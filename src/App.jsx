import { useState, useSyncExternalStore } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import { ToastContainer } from "react-toastify";
import Toastify from "./components/Toastify";

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
    if (!text) {
      Toastify({
        toastType: "error",
        message: "Empty Task Addition Not Permitted!",
      });
      return;
    }
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
        Toastify({ toastType: "success", message: "Task Added Successfully!" });
        return {
          ...prevState,
          projectsDetails: {
            projects: [...prevState.projectsDetails.projects],
            tasks: [newTask, ...prevState.projectsDetails.tasks],
          },
        };
      } else {
        Toastify({
          toastType: "error",
          message: "Duplicate Task Addition Not Permitted!",
        });
        return prevState;
      }
    });
  }

  function handleDeleteTask(id, text) {
    Toastify({
      toastType: "success",
      message: `Task "${text}" Deleted Successfully`,
    });
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

  function handleEditTask(taskId, editedTaskText) {
    if (!editedTaskText) {
      Toastify({
        toastType: "error",
        message: "Task Edit Cannot Be Empty!",
      });
      return;
    }
    setProjectsState((prevState) => {
      const isDuplicateTask = prevState.projectsDetails.tasks.find(
        (task) =>
          task.text === editedTaskText &&
          task.id !== taskId &&
          task.projectId === prevState.selectedProjectId
      );

      if (!isDuplicateTask) {
        const updatedTasks = prevState.projectsDetails.tasks.map((task) =>
          task.id === taskId && task.projectId === prevState.selectedProjectId
            ? { ...task, text: editedTaskText }
            : task
        );

        Toastify({
          toastType: "success",
          message: "Task Edited Successfully!",
        });
        return {
          ...prevState,
          projectsDetails: {
            ...prevState.projectsDetails,
            tasks: updatedTasks,
          },
        };
      } else {
        Toastify({
          toastType: "error",
          message: "Duplicate Task Not Permitted!",
        });
        return prevState;
      }
    });
  }

  function handleBack() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
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
    if (!isAdd) {
      Toastify({
        toastType: "success",
        message: "Project Addedd Successfully!",
      });

      setTimeout(() => {
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
      }, 0);
    } else {
      setProjectsState((prevState) => {
        return {
          ...projectData,
        };
      });
    }
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
    Toastify({ toastType: "success", message: "Project Edited Successfully!" });

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
    Toastify({
      toastType: "success",
      message: "Project Deleted Successfully!",
    });

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
      onEditTask={handleEditTask}
      tasks={selectedProjectTasks}
      onBack={handleBack}
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
        autoClose={1500}
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
