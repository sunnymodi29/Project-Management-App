import { useState } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projectsDetails: {
      projects: [],
      tasks: [],
    },
  });

  const [editedProject, setEditedProject] = useState();

  function handleAddTask(text) {
    setProjectsState((prevState) => {
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: Math.random(),
      };

      const selectedProjectTasks = prevState.projectsDetails.tasks.filter(
        (projectid) => projectid.projectId === prevState.selectedProjectId
      );

      const isDuplicate = selectedProjectTasks.find(
        (task) => task.text === text
      );

      if (!isDuplicate) {
        const SuccessNotify = () => toast.success("Task Added Successfully!");
        SuccessNotify();
        return {
          ...prevState,
          projectsDetails: {
            projects: [...prevState.projectsDetails.projects],
            tasks: [newTask, ...prevState.projectsDetails.tasks],
          },
        };
      } else {
        const ErrorNotify = () =>
          toast.error("Duplicate Task Addition Not Permitted!");
        ErrorNotify();
        return prevState;
      }
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
    setEditedProject(undefined);
  }

  function handleAddProject(projectData, isAdd) {
    !isAdd
      ? setProjectsState((prevState) => {
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
        })
      : setProjectsState((prevState) => {
          return {
            ...projectData,
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

  function handleEditProject(projectData, projectId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projectsDetails.projects.map(
        (project) =>
          project.id === projectId ? { ...project, ...projectData } : project
      );

      return {
        ...prevState,
        projectsDetails: {
          ...prevState.projectsDetails,
          projects: updatedProjects,
        },
        selectedProjectId: undefined,
      };
    });

    const updatedProject = { ...projectData, id: projectId };
    setEditedProject(updatedProject);
  }

  function handleStartEditProject(projectId) {
    const projectToEdit = projectsState.projectsDetails.projects.find(
      (project) => project.id === projectId
    );

    setEditedProject(projectToEdit); // Save this project in the state as the project being edited
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: null, // Switch to NewProject form
    }));
  }

  function handleDeleteProject(selectedProjectId) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projectsDetails: {
          projects: prevState.projectsDetails.projects.filter(
            (project) => project.id !== selectedProjectId
          ),
          tasks: prevState.projectsDetails.tasks.filter(
            (task) => task.projectId !== selectedProjectId
          ),
        },
      };
    });
  }

  console.log(projectsState);

  function filterSelectedProject() {
    if (projectsState) {
      if (projectsState.projectsDetails.projects) {
        const selectedProject = projectsState.projectsDetails.projects.find(
          (project) => project.id === projectsState.selectedProjectId
        );

        return selectedProject;
      }
    } else {
      return;
    }
  }

  const selectedProject = filterSelectedProject();

  const selectedProjectTasks =
    selectedProject !== undefined
      ? projectsState.projectsDetails.tasks.filter(
          (task) => task.projectId === selectedProject.id
        )
      : [];

  let content = (
    <SelectedProject
      project={selectedProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      tasks={selectedProjectTasks}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject
        onAdd={handleAddProject}
        onCancel={handleCancelAddProject}
        onEdit={handleEditProject}
        startEdit={editedProject}
      />
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
        onEdit={handleStartEditProject}
        onDelete={handleDeleteProject}
      />
      {content}
      <ToastContainer
        position="top-right"
        autoClose={1200}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
}

export default App;
