/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useMutation } from "@apollo/client";
import { RiDeleteBin5Line } from 'react-icons/ri'
import { MdModeEditOutline } from 'react-icons/md'
import axios from 'axios';
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK, GET_TASK,DELETE_BULK_TASK } from '../service/grapgqlApis';
import Create from './Create';

function TaskList() {

  // APIs calling 
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [deleteBulkTask] = useMutation(DELETE_BULK_TASK);

  const [task, setTask] = useState([]);
  const [editTask, setEditTask] = useState({ id: undefined, name: '' });
  const [name, setName] = useState("");

  // get task list apis for fetch latest task data
  const getTasks = () => {
    axios
    .request(GET_TASK)
    .then(function (response) {
      if (response.data.data.tasks && (response.data.data.tasks.length !== task.length)) {
          let items = []
          response.data.data.tasks.forEach((e) => {
            items.push({
              id: e.id,
              name: e.name,
              status: e.status
            })
          })
          setTask(items)
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    }

  useEffect(() => {
    getTasks()
  }, [task, getTasks])

  const onDragOver = ev => {
    ev.preventDefault();
  };

  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", id);
  };

  const onDrop = (ev, stu) => {
    const id = ev.dataTransfer.getData("id");

    let tasks = task.filter(task => {
      if (task.id === id) {
        task.status = stu;
        updateTask({ variables: { id: task.id, name: task.name, status: stu } })
      }
      return task;
    });
    setTask(tasks);
  };

  // function for create a new task
  const handleSubmit = async (ev) => {
    if (name !== "") {
      createTask({ variables: { name: name, status: "PUBLISHED" } })
      setName('');
    }
  };

  // function for delete task
  const handleDelete = async (id) => {
    deleteTask({ variables: { id: id } })
  }

  const handleEdit = (item) => {
    setEditTask(item)
  }

  
  const listOfIds = [];
  const handleCheck = (e , id) => {
    if (e.target.checked) {
      listOfIds.push(id);
    }else{
      const index = listOfIds.indexOf(id);
      if (index > -1) {
        listOfIds.splice(index, 1);
      }
    }
  }

  const handleBulkDelete = async ()=>{
    if (listOfIds?.length) {
      deleteBulkTask({ variables: { id: listOfIds } })
    }
  }

  const handleEditTask = async (e) => {
    setEditTask({ ...editTask, name: e.target.value })
    if ((e.key === "Enter") && (e.target.value !== "")) {
      updateTask({ variables: editTask })
      let index = task.findIndex((obj => obj.id === editTask.id));
      task[index].name = e.target.value;
      setTask(task);
      setEditTask({})
      e.target.value = "";
    }
  }

  var tasks = {
    PUBLISHED: [],
    DRAFT: [],
    ACTIVE: []
  };

  // filter all task categories wise
  task.length > 0 && task.forEach(t => {
    tasks[t.status].push(
      <div
        className="p-[15px] bg-[#146C94] m-[20px] text-[#fff] font-[100] cursor-grab rounded-[4px] flex justify-between items-center h-[60px] hover:bg-[#146b94cc]"
        key={t.id}
        draggable
        onDragStart={e => onDragStart(e, t.id)}
      >
        {
          editTask.id === t.id ?
            <input type='text' className='outline-none h-full px-[10px] flex flex-grow mr-[36px] text-[#146C94] text-[15px] rounded-[4px] border-none ' value={editTask.name} onChange={e => handleEditTask(e)} onKeyPress={e => handleEditTask(e)} />
            :
            <p>{t.name}</p>
        }
        <div className='flex'>
          <MdModeEditOutline className='text-[20px] cursor-pointer' onClick={() => handleEdit(t)} />
          <RiDeleteBin5Line className='text-[20px] cursor-pointer ml-[10px]' onClick={() => handleDelete(t.id)} />
          <input class="form-check-input mx-3" type="checkbox" onChange={(e) => handleCheck(e,t.id)} id="flexCheckDefault"/>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className='fixed bg-cover w-screen bg-no-repeat h-screen -z-10'></div>
      <button
        type='button'
        className='bg-[#990012] h-[40px] rounded-[5px] text-[16px] px-[10px] text-white hover:bg-[#C24641]'
        onClick={handleBulkDelete}
      >
        Delete in Bulk
      </button>
      <div className="flex justify-center items-start pt-[32px] ">
        <div
          className="bg-[#F6F1F1] h-[600px] overflow-auto m-[5px] pb-[20px] w-[33%] rounded-[10px]"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "PUBLISHED")}
        >
          <h1 className='text-[#146C94] pt-[20px] pl-[20px] text-[17px] font-[100] tracking-[2px]'>PUBLISHED</h1>
          {tasks.PUBLISHED}
        </div>
        <div
          className="bg-[#F6F1F1] h-[600px] overflow-auto m-[5px] pb-[20px] w-[33%] rounded-[10px]"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "DRAFT")}
        >
          <h1 className='text-[#146C94] pt-[20px] pl-[20px] text-[17px] font-[100] tracking-[2px]'>DRAFT</h1>
          {tasks.DRAFT}
        </div>
        <div
          className="bg-[#F6F1F1] h-[600px] overflow-auto m-[5px] pb-[20px] w-[33%] rounded-[10px]"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "ACTIVE")}
        >
          <h1 className='text-[#146C94] pt-[20px] pl-[20px] text-[17px] font-[100] tracking-[2px]'>ACTIVE</h1>
          {tasks.ACTIVE}
        </div>
      </div>


      <Create
        name={name}
        changeName={setName}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default TaskList;
