import moment from 'moment'
import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { RxUpdate } from 'react-icons/rx'
import { VscLocation } from 'react-icons/vsc'

const ViewEditTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div className='relative'>
        <div className='flex items-center justify-end'>
            <div>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                 <button className='btn-small' onClick={onEditClick}>
                     <RxUpdate className='text-lg'/>Update
                 </button>

                 <button className='btn-small btn-delete' onClick={onDeleteClick}>
                     <AiOutlineDelete className='text-lg'/> Delete
                 </button>

                 <button className='cursor-pointer' onClick={onClose}>
                     <IoCloseCircleSharp className='text-xl text-slate-400' /> 
                 </button>
                </div> 
            </div>
        </div>
        <div className='flex-1 flex flex-col gap-2 py-4'>
            <h1 className='text-2xl text-slate-950'>
                {storyInfo && storyInfo.title}
            </h1>

            <div className='flex items-center justify-between gap-3'>
                <span className='text-xs text-slate-500'>
                    {storyInfo && moment(storyInfo.visitedDate).format("MMM Do YYYY")}
                </span>

                <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded-sm px-2 py-1'>
                   <VscLocation className='text-sm'/>
                   {storyInfo && 
                     storyInfo.visitedLocation.map((item, index) => 
                       storyInfo.visitedLocation.length === index + 1 
                       ? `${item}` 
                       : `${item},`
                    )}
                </div>
            </div>
        </div>

        <img 
          src={storyInfo && storyInfo.imageUrl} 
          alt="img"
          className='w-full h-[300px] object-cover rounded-lg' 
        />

        <div className='mt-4'>
            <p className='text-sm text-slate-800 leading-6 text-justify whitespace-pre-line'>
                {storyInfo.story}
            </p>
        </div>
    </div>

  )
}

export default ViewEditTravelStory