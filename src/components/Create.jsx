import React from 'react'

function Create({ name, changeName, handleSubmit }) {
  return (
    <>
      <div className='flex justify-center items-center'>
        <input
          className="border-[2px] border-solid border-[#146C94] block my-[50px] mr-[10px] w-[500px] h-[50px] rounded-[5px] text-[16px] pl-[25px] bg-[#ffffffcc] outline-none text-[#146C94] focus: bg-white border-[3px] border-solid border-[#146C94] placeholder: text-[#146C94]"
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={e => changeName(e.target.value)}
        />
        <button type='button' className='bg-[#146C94] h-[40px] rounded-[5px] text-[16px] px-[10px] text-white hover:bg-[#146b94d3]' onClick={e => handleSubmit(e)} >Add Task</button>
      </div>
    </>
  )
}

export default Create;