import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const UseProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [selectedProjectId, setselectedProjectId] = useLocalStorage(
    "LazyStash-project-id",
    "",
  );

  const project = projects?.find((project) => project.id === selectedProjectId);

  return {
    projects,
    project,
    selectedProjectId,
    setselectedProjectId,
  };
};

export default UseProject;
