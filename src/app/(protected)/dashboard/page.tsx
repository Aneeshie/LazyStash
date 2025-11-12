"use client";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import UseProject from "~/hooks/use-project";
import CommitLog from "./commit-log";

const Dashboard = () => {
  const { project } = UseProject();

  return (
    <div>
      {project?.id}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-y-4 px-4">
        {/* github url  */}
        <div className="bg-primary w-fit rounded-md px-5 py-4">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.repoUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.repoUrl}
                  <ExternalLink className="ml-2 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          Team Members Invite Button Archive button
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          Ask Question Card. Meeting Card
        </div>
      </div>

      <div className="mt-9">
        <CommitLog />
      </div>
    </div>
  );
};

export default Dashboard;
