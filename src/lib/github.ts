import { Octokit } from "octokit";
import { db } from "~/server/db";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});


type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthor: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (url: string): Promise<Response[]> => {
  const [owner, repo] =url.split("/").slice(-2);

  console.log(owner, repo);

  if (!owner || !repo) {
    throw new Error("Could not retriever either owner or repo");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner: owner!,
    repo: repo!,
  });

  const sortedCommit = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any[];

  return sortedCommit.slice(0, 12).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthor: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

  const commitHashes = await getCommitHashes(githubUrl);

  const rawCommits = await filterRawCommits(projectId, commitHashes);

  const summaryResponses = await Promise.allSettled(
    rawCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      const raw = rawCommits[index];
      console.log("processing commit:", raw?.commitHash);
      return {
        projectId,
        commitHash: raw?.commitHash ?? "",
        commitMessage: raw?.commitMessage ?? "",
        commitAuthor: raw?.commitAuthor ?? "",
        commitAuthorAvatar: raw?.commitAuthorAvatar ?? "",
        commitDate: raw?.commitDate ?? "",
        summary,
      };
    }),
  });

  return commits;
};

async function summarizeCommit(githubUrl: string, commitHash: string) {
  //get the diff then pass the diff into AI

  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  return (await aiSummarizeCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      repoUrl: true,
    },
  });

  if (!project?.repoUrl) {
    throw new Error("Project has no github Url");
  }

  return { project, githubUrl: project?.repoUrl };
}

async function filterRawCommits(projectId: string, commitHashes: Response[]) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const rawCommit = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return rawCommit;
}
// await pollCommits("cmhus36ak000jzzxi8smd2j9m").then(console.log);
