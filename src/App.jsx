import { useEffect, useState } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import { ToastContainer } from "react-toastify";
import Toastify from "./components/Toastify";

import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import app from "./firebase/firebase-config";
import { v4 as uuid } from "uuid";

const db = getFirestore(app);

let intialObject = {
  selectedProjectId: "",
  projectsDetails: {
    projects: [],
    tasks: [],
  },
};

function App() {
  const [projectsState, setProjectsState] = useState(intialObject);

  const [editedProject, setEditedProject] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Firestore on initial render/reload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "projectsData", "projectsDataDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();

          const validatedState = {
            selectedProjectId: fetchedData.selectedProjectId || "",
            projectsDetails: {
              projects: fetchedData.projectsDetails?.projects || [],
              tasks: fetchedData.projectsDetails?.tasks || [],
            },
          };
          setProjectsState(validatedState);
        } else {
          const docRef = doc(db, "projectsData", "projectsDataDoc");
          await setDoc(docRef, projectsState);

          setProjectsState(projectsState);
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update Firestore whenever projectsState changes
  useEffect(() => {
    const updateFirestore = async () => {
      try {
        const docRef = doc(db, "projectsData", "projectsDataDoc");
        await updateDoc(docRef, projectsState);

        console.log(projectsState);
      } catch (error) {
        console.error("Error updating Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectsState.projectsDetails.projects.length > 0) {
      updateFirestore();
    }
  }, [projectsState]);

  function handleAddTask(text) {
    if (!text) {
      Toastify({
        toastType: "error",
        message: "Empty Task Addition Not Permitted!",
      });
      return;
    }

    if (!projectsState.selectedProjectId) {
      Toastify({
        toastType: "error",
        message: "No project selected to add the task.",
      });
      return;
    }

    setProjectsState((prevState) => {
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: uuid(),
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
        selectedProjectId: "",
      };
    });
  }

  function handleSelectedProject(id) {
    const isValidProject = projectsState.projectsDetails.projects.some(
      (project) => project.id === id
    );

    if (isValidProject) {
      setProjectsState((prevState) => ({
        ...prevState,
        selectedProjectId: id,
      }));
    } else {
      Toastify({
        toastType: "error",
        message: "The selected project does not exist.",
      });
    }
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
    setEditedProject("");
  }

  function handleAddProject(projectData, isAdd) {
    try {
      if (!isAdd) {
        setProjectsState((prevState) => {
          const newProject = {
            ...projectData,
            id: uuid(),
          };

          return {
            ...prevState,
            selectedProjectId: "",
            projectsDetails: {
              projects: [...prevState.projectsDetails.projects, newProject],
              tasks: [...prevState.projectsDetails.tasks],
            },
          };
        });

        Toastify({
          toastType: "success",
          message: "Project Addedd Successfully!",
        });
      } else {
        setProjectsState((prevState) => {
          return {
            ...projectData,
          };
        });
      }
    } catch (error) {
      Toastify({
        toastType: "error",
        message: error,
      });
    }
  }

  function handleCancelAddProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: "",
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
        selectedProjectId: "",
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

  function handleDeleteProject(selectedProjectId, projectTitle) {
    Toastify({
      toastType: "success",
      message: `Project "${projectTitle}" Deleted Successfully!`,
    });

    setProjectsState((prevState) => {
      const filteredProjects = prevState.projectsDetails.projects.filter(
        (project) => project.id !== selectedProjectId
      );

      const filteredTasks = prevState.projectsDetails.tasks.filter(
        (task) => task.projectId !== selectedProjectId
      );

      const updatedState = {
        ...prevState,
        selectedProjectId: "",
        projectsDetails: {
          projects: filteredProjects,
          tasks: filteredTasks,
        },
      };

      if (filteredProjects.length === 0) {
        // If no projects left, clear the Firestore document
        const clearFirestoreData = async () => {
          try {
            const docRef = doc(db, "projectsData", "projectsDataDoc");
            await setDoc(docRef, intialObject);
          } catch (error) {
            console.error(error);
          }
        };
        clearFirestoreData();
      }

      return updatedState;
    });
  }

  function filterSelectedProject() {
    if (!projectsState || !projectsState.projectsDetails.projects) return null;

    const selectedProject = projectsState.projectsDetails.projects.find(
      (project) => project.id === projectsState.selectedProjectId
    );

    return selectedProject || null;
  }

  const selectedProject = filterSelectedProject();

  const selectedProjectTasks = selectedProject
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
  } else if (projectsState.selectedProjectId === "") {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <>
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-spinner"></div>
        </div>
      )}

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
    </>
  );
}

export default App;
