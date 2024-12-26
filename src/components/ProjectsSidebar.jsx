import { useRef, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { Tooltip } from "react-tooltip";
// import Options from "./Options";

function ProjectsSidebar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
  onEdit,
  onDelete,
  onLogout,
  userProfile,
}) {
  const modal = useRef();
  const sidebarRef = useRef();
  const backdropRef = useRef();

  let isEdit = false;
  function handleEditProject(id) {
    isEdit = true;
    const editedProject = projects.filter((project) => project.id === id);
    onEdit(id, isEdit, editedProject);
  }

  const userProfileVal =
    userProfile.displayName.split(" ").length > 1
      ? userProfile.displayName.split(" ")[0].charAt(0) +
        userProfile.displayName.split(" ").slice(-1).toString().charAt(0)
      : userProfile.displayName.split(" ")[0].charAt(0);

  const userProfileTooltipVal = userProfile.displayName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .toString()
    .replaceAll(",", " ");

  const isLongUserName = userProfile.displayName.length > 14;

  function toggleSidebar() {
    const sidebar = sidebarRef.current;
    const backdrop = backdropRef.current;

    if (window.innerWidth < 768) {
      if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
        backdrop.classList.remove("hidden");
        requestAnimationFrame(() => {
          sidebar.classList.add("slide-in");
          backdrop.classList.add("fade-in");
        });
      } else {
        sidebar.classList.remove("slide-in");
        sidebar.classList.add("slide-out");
        backdrop.classList.remove("fade-in");
        backdrop.classList.add("fade-out");

        // Wait for animation to finish before hiding
        setTimeout(() => {
          sidebar.classList.add("hidden");
          sidebar.classList.remove("slide-out");
          backdrop.classList.add("hidden");
          backdrop.classList.remove("fade-out");
        }, 300); // Duration matches CSS transition
      }
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    function handleScreenResize() {
      if (mediaQuery.matches) {
        const sidebar = sidebarRef.current;
        const backdrop = backdropRef.current;

        sidebar.classList.remove("hidden", "slide-in", "slide-out");
        backdrop.classList.add("hidden");
        sidebar.classList.add("hidden");
        backdrop.classList.remove("fade-in", "fade-out");
      }
    }

    mediaQuery.addEventListener("change", handleScreenResize);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, []);

  return (
    <>
      <div
        ref={backdropRef}
        className="backdrop hidden fixed inset-0 bg-opacity-50 z-50 md:!hidden"
        onClick={toggleSidebar}
      ></div>
      <Modal ref={modal} buttonCaption="Save">
        <h2>Edit</h2>
      </Modal>

      <nav className="md:hidden p-3 sticky top-0 bg-stone-50 z-30">
        <div className="flex justify-between items-center">
          <div
            className="cursor-pointer"
            data-tooltip-id="dark_tooltip"
            data-tooltip-content="Open Menu"
            data-tooltip-place="bottom-start"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8 text-stone-900"
            >
              <path
                fillRule="evenodd"
                d="M3,6.75 A0.75,0.75,0,0,1,3.75,6 h16.5 a0.75,0.75,0,0,1,0,1.5 H3.75 A0.75,0.75,0,0,1,3,6.75 M3,12 a0.75,0.75,0,0,1,0.75,-0.75 h12.5 a0.75,0.75,0,0,1,0,1.5 H3.75 A0.75,0.75,0,0,1,3,12 m0,5.25 a0.75,0.75,0,0,1,0.75,-0.75 h8.5 a0.75,0.75,0,0,1,0,1.5 H3.75 a0.75,0.75,0,0,1,-0.75,-0.75 Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-4 justify-center items-center">
              <div
                data-tooltip-id="dark_tooltip"
                data-tooltip-content={userProfileTooltipVal}
                data-tooltip-place="bottom"
              >
                {userProfile.photoURL?.startsWith("https://") ? (
                  <img
                    src={userProfile.photoURL}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                ) : (
                  <div className="max-w-8 max-h-8 bg-stone-400 p-4 flex justify-center items-center rounded-full select-none">
                    <span className="flex justify-center items-center text-lg font-bold text-stone-700 uppercase">
                      {userProfileVal}
                    </span>
                  </div>
                )}
                {/* <Tooltip id="userName_tooltip" /> */}
              </div>
              <div
                className="cursor-pointer"
                data-tooltip-id="dark_tooltip"
                data-tooltip-content="New Project"
                data-tooltip-place="bottom"
                onClick={onStartAddProject}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 19 19"
                  fill="currentColor"
                  className="size-7 text-stone-700"
                >
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path>
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path>
                </svg>
              </div>
            </div>
            <div className="text-stone-500">|</div>
            <div
              onClick={onLogout}
              className="text-white transition-all cursor-pointer"
              data-tooltip-id="dark_tooltip"
              data-tooltip-content="Logout"
              data-tooltip-place="bottom-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 text-stone-800 hover:text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                />
              </svg>

              {/* <Tooltip id="logout_tooltip" /> */}
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={sidebarRef}
        className="sidebar h-full w-72 max-w-72 min-w-72 hidden md:block transition-transform z-20"
      >
        <div
          className="absolute -right-7 z-30 bg-gray-100 rounded-r-lg w-8 h-10 p-1 cursor-pointer top-0 flex items-center justify-center md:hidden"
          data-tooltip-id="dark_tooltip"
          data-tooltip-content="Close"
          data-tooltip-place="bottom-start"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <aside
          className="px-8 py-6 bg-gray-100 text-stone-50 flex flex-col overflow-hidden flex-1 w-72 min-w-72 max-w-72 h-full fixed md:block top-0"
          onClick={toggleSidebar}
        >
          <div className="flex justify-between items-center mb-8">
            <div
              className="flex justify-center items-center gap-2"
              data-tooltip-id={isLongUserName ? "dark_tooltip" : null}
              data-tooltip-content={
                isLongUserName ? userProfileTooltipVal : null
              }
              data-tooltip-place="bottom"
            >
              <div
              // data-tooltip-id="dark_tooltip"
              // data-tooltip-content={userProfileTooltipVal}
              // data-tooltip-place="right"
              >
                {userProfile.photoURL?.startsWith("https://") ? (
                  <img
                    src={userProfile.photoURL}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                ) : (
                  <div className="max-w-8 max-h-8 bg-stone-400 p-4 flex justify-center items-center rounded-full select-none">
                    <span className="flex justify-center items-center text-lg font-bold text-stone-950 uppercase">
                      {userProfileVal}
                    </span>
                  </div>
                )}
                {/* <Tooltip id="userName_tooltip" /> */}
              </div>
              <div className="flex flex-col flex-wrap">
                {/* <div>Hello,</div> */}
                <div className="w-28 truncate font-bold text-stone-800">
                  {userProfile.displayName}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center items-center flex-row-reverse">
              <div onClick={toggleSidebar} className="md:hidden">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M3,6.75 A0.75,0.75,0,0,1,3.75,6 h16.5 a0.75,0.75,0,0,1,0,1.5 H3.75 A0.75,0.75,0,0,1,3,6.75 M3,12 a0.75,0.75,0,0,1,0.75,-0.75 h12.5 a0.75,0.75,0,0,1,0,1.5 H3.75 A0.75,0.75,0,0,1,3,12 m0,5.25 a0.75,0.75,0,0,1,0.75,-0.75 h8.5 a0.75,0.75,0,0,1,0,1.5 H3.75 a0.75,0.75,0,0,1,-0.75,-0.75 Z"
                    clipRule="evenodd"
                  ></path>
                </svg> */}
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg> */}
              </div>
              <div
                onClick={onLogout}
                className="transition-all cursor-pointer hidden md:block"
                data-tooltip-id="dark_tooltip"
                data-tooltip-content="Logout"
                data-tooltip-place="bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 dark:text-stone-800 hover:text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-900">
            Your Projects
          </h2>
          <div>
            <Button onClick={onStartAddProject}>+ Add Project</Button>
          </div>
          <ul className="mt-5 overflow-auto">
            {projects.map((project) => {
              let cssClasses =
                "projectAdded w-full text-left px-2 py-2 rounded-sm hover:text-stone-900 hover:bg-gray-200 overflow-hidden flex justify-between align items-center cursor-pointer hover:gap-1 transition-all";

              if (project.id === selectedProjectId) {
                cssClasses += " bg-gray-200 font-bold text-stone-900";
              } else {
                cssClasses += " text-stone-900";
              }

              return (
                <li key={project.id} id={project.id} className="relative">
                  <div className={cssClasses}>
                    <span
                      className="projectTitle w-full hover:w-4/5 truncate"
                      onClick={() => onSelectProject(project.id)}
                    >
                      {project.title}
                    </span>
                    <div className="projectOptions mt-px gap-2 hidden flex">
                      <span
                        className="editOption cursor-pointer"
                        data-tooltip-id="dark_tooltip"
                        data-tooltip-content="Edit"
                        data-tooltip-place="top"
                        onClick={() => handleEditProject(project.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="onNormal"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="hidden onHover"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                      </span>
                      {/* <Tooltip id="edit_tooltip" /> */}
                      <span
                        className="deleteOption cursor-pointer"
                        data-tooltip-id="dark_tooltip"
                        data-tooltip-content="Delete"
                        data-tooltip-place="top"
                        onClick={() => onDelete(project.id, project.title)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="onNormal"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="hidden onHover"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {/* <Tooltip id="delete_tooltip" /> */}
                      {/* <Options
                      editFunction={handleEditProject}
                      deleteFunction={onDelete}
                      projectId={project.id}
                      isEditOption={true}
                      isDeleteOption={true}
                    /> */}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </>
  );
}

export default ProjectsSidebar;
