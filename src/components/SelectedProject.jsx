import Tasks from "./Tasks";

const SelectedProject = ({ project, onAddTask, onDeleteTask, tasks }) => {
  const formattedDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-[35rem] mt-16">
      <header className="pb-4 mb-4 border-b-2 border-x-stone-300">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-stone-600">{project.title}</h1>
          <p className="text-stone-400">{formattedDate}</p>
        </div>
        <p className="text-stone-600 whitespace-pre-wrap">
          {project.description}
        </p>
      </header>
      <Tasks
        onAdd={onAddTask}
        onDelete={onDeleteTask}
        tasks={tasks}
        selectedProject={project}
      />
    </div>
  );
};

export default SelectedProject;
