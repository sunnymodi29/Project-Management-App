import { useState } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projectsDetails: {
      projects: [],
      tasks: [],
    },
  });

  function handleAddTask(text) {
    setProjectsState((prevState) => {
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: Math.random(),
      };

      return {
        ...prevState,
        projectsDetails: {
          projects: [...prevState.projectsDetails.projects],
          tasks: [newTask, ...prevState.projectsDetails.tasks],
        },
      };
    });
  }

  function handleDeleteTask(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        projectsDetails: {
          projects: [...prevState.projectsDetails.projects],
          tasks: prevState.projectsDetails.tasks.filter(
            (task) => task.id !== id
          ),
        },
      };
    });
  }

  function handleSelectedProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleAddProject(projectData) {
    setProjectsState((prevState) => {
      const newProject = {
        ...projectData,
        id: Math.random() * 10,
      };

      return {
        ...prevState,
        selectedProjectId: undefined,
        projectsDetails: {
          projects: [...prevState.projectsDetails.projects, newProject],
          tasks: [...prevState.projectsDetails.tasks],
        },
      };
    });
  }

  function handleCancelAddProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleDeleteProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projectsDetails: {
          projects: prevState.projectsDetails.projects.filter(
            (project) => project.id !== prevState.selectedProjectId
          ),
          tasks: prevState.projectsDetails.tasks.filter(
            (task) => task.projectId !== prevState.selectedProjectId
          ),
        },
      };
    });
  }

  console.log(projectsState);

  const selectedProject = projectsState.projectsDetails.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );

  const selectedProjectTasks = selectedProject !== undefined ? projectsState.projectsDetails.tasks.filter(
    (task) => task.projectId === selectedProject.id
  ) : [];

  let content = (
    <SelectedProject
      project={selectedProject}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      tasks={selectedProjectTasks}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar
        onStartAddProject={handleStartAddProject}
        projects={projectsState.projectsDetails.projects}
        onSelectProject={handleSelectedProject}
        selectedProjectId={projectsState.selectedProjectId}
      />
      {content}
    </main>
  );
}

export default App;
