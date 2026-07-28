import React, { useState } from 'react'
import { RiAddLargeFill } from 'react-icons/ri'
import { IoCloseCircleSharp } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx"
import { AiOutlineDelete } from "react-icons/ai";
import DateSelector from './DateSelector';
import ImageSelector from './ImageSelector';
import TagInput from './TagInput';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment'
import { toast } from "react-toastify"
import uploadImage from '../utils/uploadImage';


const AddEditTravelStory = ({ 
    storyInfo, 
    type, 
    onClose, 
    getAllTravelStories 
}) => {
    const [visitedDate, setVisitedDate] = useState(null)
    const [title,setTitle] = useState("")
    const [storyImg,setStoryImg] = useState(null)
    const [story,setStory] = useState("")
    const [visitedLocation,setVisitedLocation] = useState([])
    const [error, setError] = useState("")

    const addNewTravelStory = async() =>{
        try {
            let imageUrl = ""

            if(storyImg){
                const imgUploadRes = await uploadImage(storyImg)

                imageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.post("/travel-story/add", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate 
                 ? moment(visitedDate.valueOf()) 
                 : moment().valueOf(),
            })

            if(response.data && response.data.story){
                toast.success("Story added")
                getAllTravelStories()

                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateTravelStory = async () => {}

    const handleAddOrUpdateClick = () => {
        if(!title){
            setError("enter title")
            return
        }

        if(!story){
            setError("enter story")
            return
        }

        setError("")

        if(type === "edit"){
            updateTravelStory()
        }else{
            addNewTravelStory()
        }
    }

    const handleDeleteStoryImage = () => {}

  return (
    <div>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type === "add" ? "Add Story" : "Update Story"}
            </h5>

            <div>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                {type === "add" ? (
                    <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <RiAddLargeFill className='text-lg'/> Add
                    </button>
                ) : (
                    <>
                        <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <RxUpdate className='text-lg'/> Update
                        </button>

                        <button className='btn-small btn-delete'>
                            <AiOutlineDelete className='text-lg'/> Delete
                        </button>
                    </>
                )}

                <button className='' onClick={onClose}>
                    <IoCloseCircleSharp className='text-xl text-slate-400' /> 
                </button>
                </div>

                {error && (
                    <p className='text-red-500 text-sm pt-2 text-right'>{error}</p>
                )}
            </div>
        </div>

        <div>
            <div className='flex flex-1 flex-col gap-2 pt-4'>
                <label className='input-label'>Title</label>

                <input 
                    type="text" 
                    className='text-2x1 text-slate-900 outline-none' 
                    placeholder='Trip...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className='my-3'>
                    <DateSelector date={visitedDate} setDate={setVisitedDate}/>
                </div>

                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteStoryImage} />

                <div className='flex flex-col gap-2 mt-4'>
                    <label className="input-label">Story</label>

                    <textarea 
                        className='text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm' 
                        placeholder='Your story' 
                        rows={10} 
                        value={story} 
                        onChange={(e)=>setStory(e.target.value)}
                    />
                </div>

                <div className='pt-3'>
                    <label className="input-label">Location</label>

                    <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddEditTravelStory