import Button from "./Button";
import Tasks from "./Tasks";

const SelectedProject = ({
  project,
  onAddTask,
  onDeleteTask,
  onEditTask,
  tasks,
  onBack,
  updateTaskStatus,
}) => {
  const formattedDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full overflow-auto">
      <div className="2xl:w-full 2xl:p-0 lg:w-full lg:p-0 md:w-full md:p-0 md:mt-6 flex flex-col w-full px-6 mt-8">
        <div className="mb-8 md:ml-4">
          <Button onClick={onBack} type="cancel">
            Cancel
          </Button>
        </div>
        <div className="card p-8 rounded-2xl mb-4 md:ml-4 md:mr-12">
          <header className="pb-4 mb-4 border-b-2 border-x-stone-300">
            <div className="md:flex justify-between mb-2">
              <h1 className="text-3xl font-bold text-stone-600 break-all md:w-3/4">
                {project.title}
              </h1>
              <p className="text-stone-400 mt-3">{formattedDate}</p>
            </div>
            <p className="text-stone-600 whitespace-pre-wrap">
              {project.description}
            </p>
          </header>
          <Tasks
            onTaskAdd={onAddTask}
            onTaskDelete={onDeleteTask}
            onEditTask={onEditTask}
            tasks={tasks}
            updateTaskStatus={updateTaskStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedProject;
