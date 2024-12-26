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
import { v4 as uuid } from "uuid";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app, { auth } from "./firebase/firebase-config";
import LoginScreen from "./components/LoginScreen";
import { Tooltip } from "react-tooltip";

const db = getFirestore(app);

let initialUserData = {
  selectedProjectId: "",
  projectsDetails: {
    projects: [],
    tasks: [],
  },
};

function App() {
  const [projectsState, setProjectsState] = useState(initialUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutMode, setLogoutMode] = useState(false);
  const [editedProject, setEditedProject] = useState();
  const [userProfile, setUserProfile] = useState("");

  /* User Login, SignUp, Logout And User Wise Data Logic Starts */

  // Login Handler
  async function handleLogin(email, password) {
    if (email && password) {
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        Toastify({
          toastType: "success",
          message: "Logged In Successfully!",
        });
      } catch (error) {
        Toastify({ toastType: "error", message: "Invalid Credentials" });
      }
    } else {
      Toastify({
        toastType: "error",
        message: "Please Provide Valid Details",
      });
    }
    setIsLoading(false);
  }

  // Google Login Handler
  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await Promise.race([signInWithPopup(auth, provider)]);
      const user = result.user;

      setUser(user);
      setIsAuthenticated(true);
      Toastify({ toastType: "success", message: "Logged in Successfully!" });
    } catch (error) {}
  }

  // Sign Up Handler
  async function handleSignUp(username, email, password) {
    if (username && email && password) {
      setIsLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        Toastify({ toastType: "success", message: "Signed Up Successfully!" });

        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        Toastify({ toastType: "error", message: "Invalid Credentials!" });
      }
    } else {
      Toastify({
        toastType: "error",
        message: "Please Provide Valid Details",
      });
    }
    setIsLoading(false);
  }

  // Authenticate the user when the application loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setIsDataLoaded(false);
      if (currentUser) {
        setUserProfile(currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);

        try {
          await loadUserData(currentUser.uid);
        } catch (error) {
          console.error(
            "Error loading user data on authentication state change:",
            error
          );
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setProjectsState(initialUserData);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user-specific data from Firestore on authentication
  async function loadUserData(uid) {
    try {
      const userDocRef = doc(db, "projectsData", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const fetchedData = userDoc.data();

        const validatedState = {
          selectedProjectId:
            fetchedData.selectedProjectId || initialUserData.selectedProjectId,
          projectsDetails: {
            projects: fetchedData.projectsDetails?.projects || [],
            tasks: fetchedData.projectsDetails?.tasks || [],
          },
        };

        setProjectsState(validatedState);
      } else {
        await setDoc(userDocRef, initialUserData);
        setProjectsState(initialUserData);
      }

      setIsDataLoaded(true);
    } catch (error) {
      Toastify({ toastType: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  // Automatically save updated `projectsState` to Firestore
  useEffect(() => {
    async function saveUserData() {
      if (!user || !isAuthenticated || !isDataLoaded || logoutMode) return;

      try {
        const userDocRef = doc(db, "projectsData", user.uid);

        const validState = {
          selectedProjectId: projectsState.selectedProjectId || "",
          projectsDetails: {
            projects: projectsState.projectsDetails?.projects || [],
            tasks: projectsState.projectsDetails?.tasks || [],
          },
        };

        await updateDoc(userDocRef, validState);
      } catch (error) {
        Toastify({ toastType: "error", message: error.message });
      }
    }

    if (isAuthenticated && user) {
      saveUserData();
    }
  }, [projectsState, user, isAuthenticated, isDataLoaded, logoutMode]);

  // Logout Handler
  async function handleLogout() {
    try {
      setLogoutMode(true);

      await signOut(auth);

      setProjectsState(initialUserData);
      setIsAuthenticated(false);
      setUser(null);
      setLogoutMode(false);
      setIsDataLoaded(true);
      Toastify({ toastType: "success", message: "Logged Out Successfully!" });
    } catch (error) {
      Toastify({ toastType: "error", message: error.message });
    }
  }

  /* User Login, SignUp, Logout And User Wise Data Logic Ends */

  /* Project Logic Starts */

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
    setEditedProject("");
  }

  function handleCancelAddProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: "",
      };
    });
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

  function handleDeleteProject(selectedProjectId, projectTitle) {
    if (!user || !isAuthenticated) {
      console.error("Cannot delete project: User is not authenticated.");
      return;
    }

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
        async function clearFirestoreData() {
          try {
            const userDocRef = doc(db, "projectsData", user.uid);

            const remainingProjects =
              projectsState.projectsDetails.projects.filter(
                (project) => project.id !== selectedProjectId
              );

            if (remainingProjects.length === 0) {
              await setDoc(userDocRef, initialUserData);
            } else {
              const updatedState = {
                selectedProjectId: "",
                projectsDetails: {
                  projects: remainingProjects,
                  tasks: projectsState.projectsDetails.tasks.filter(
                    (task) => task.projectId !== selectedProjectId
                  ),
                },
              };

              await setDoc(userDocRef, updatedState);
            }
          } catch (error) {
            Toastify({ toastType: "error", message: error.message });
          }
        }
        clearFirestoreData();
      }

      return updatedState;
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

  /* Project Logic Ends */

  /* Task Logic Starts */

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
        taskStatus: "Not Selected",
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

  function handleTaskStatus(taskId, taskStatus) {
    setProjectsState((prevState) => {
      const updatedTasks = prevState.projectsDetails.tasks.map((task) =>
        task.id === taskId && task.projectId === prevState.selectedProjectId
          ? { ...task, taskStatus: taskStatus }
          : task
      );

      return {
        ...prevState,
        projectsDetails: {
          ...prevState.projectsDetails,
          tasks: updatedTasks,
        },
      };
    });
  }

  /* Task Logic Ends */

  /* Back Logic Starts */

  function handleBack() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: "",
      };
    });
  }

  /* Back Logic Ends */

  /* App Content Showing Logic Starts */

  let content = (
    <SelectedProject
      project={selectedProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onEditTask={handleEditTask}
      tasks={selectedProjectTasks}
      onBack={handleBack}
      updateTaskStatus={handleTaskStatus}
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
      {isLoading ? (
        <div className="loader-overlay">
          <div className="loader-spinner"></div>
        </div>
      ) : !isAuthenticated ? (
        <LoginScreen
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : (
        <main className="flex w-full h-full gap-0 md:gap-8 md:flex-row flex-col">
          <ProjectsSidebar
            onStartAddProject={handleStartAddProject}
            projects={projectsState.projectsDetails.projects}
            onSelectProject={handleSelectedProject}
            selectedProjectId={projectsState.selectedProjectId}
            onEdit={handleStartEditProject}
            onDelete={handleDeleteProject}
            onLogout={handleLogout}
            userProfile={userProfile}
          />
          {content}
        </main>
      )}

      <Tooltip id="dark_tooltip"></Tooltip>

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
    </>
  );

  /* App Content Showing Logic Starts */
}

export default App;
