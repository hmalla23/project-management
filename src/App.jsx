import {useState, useEffect} from 'react';

import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import SelectedProject from './components/SelectedProject.jsx';

function App() {
  const [projectsState, setProjectsState] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem('projectsState');
    return saved
      ? JSON.parse(saved)
      : { selectedProjectId: undefined, projects: [], tasks: [] };
  });

  // Save to localStorage whenever projectsState changes
  useEffect(() => {
    localStorage.setItem('projectsState', JSON.stringify(projectsState));
  }, [projectsState]);

  function handleAddTask(text) {
    setProjectsState((prevState) =>{
      const taskId = Math.random();
      const newTask ={
        text: text,
        projectId: prevState.selectedProjectId,
        id: taskId,
      };

      return{
        ...prevState,
        tasks: [...prevState.tasks, newTask]
      };
    });
  }

  function handleDeleteTask(id) {
    setProjectsState((prevState) =>{
      return{
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== id),
      };
    });
  }

  function handleSelectProject(id){
    setProjectsState((prevState) =>{
      return{
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleStartAddProject(){
    setProjectsState((prevState) =>{
      return{
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleCancelAddProject(){
    setProjectsState((prevState) =>{
      return{
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleAddProject(projectData){
    setProjectsState((prevState) =>{
      const projectId = Math.random();
      const newProject ={
        ...projectData,
        id: projectId,
      };

      return{
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject]
      }
    });
  }

  function handleDeleteProject() {
  setProjectsState((prevState) => {
    // Find the project ID to delete
    const projectIdToDelete = prevState.selectedProjectId;
    return {
      ...prevState,
      selectedProjectId: undefined,
      projects: prevState.projects.filter(
        (project) => project.id !== projectIdToDelete
      ),
      // Remove tasks that belong to the deleted project
      tasks: prevState.tasks.filter(
        (task) => task.projectId !== projectIdToDelete
      ),
    };
  });
}
  

  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId);

    const selectedProjectTasks = projectsState.tasks.filter(
  (task) => task.projectId === projectsState.selectedProjectId
);


  let content = (
  <SelectedProject 
   project={selectedProject} 
   onDelete={handleDeleteProject} 
   onAddTask={handleAddTask}
   onDeleteTask={handleDeleteTask}
   tasks={selectedProjectTasks}
   />
  );

  if(projectsState.selectedProjectId === null){
    content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject}/>
  }else if (projectsState.selectedProjectId === undefined){
    content = <NoProjectSelected onStartAddProject={handleStartAddProject}/>;
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar onStartAddProject={handleStartAddProject} 
      projects={projectsState.projects}
      onSelectProject={handleSelectProject}
      selectedProjectId={projectsState.selectedProjectId}
      />
      {content}
    </main>
  );
}

export default App;
