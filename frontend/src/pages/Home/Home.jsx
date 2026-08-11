import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import TravelStoryCard from '../../components/TravelStoryCard'
import { data } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import { RiAddLargeFill } from "react-icons/ri";
import Modal from "react-modal"
import AddEditTravelStory from '../../components/AddEditTravelStory'
import ViewEditTravelStory from './ViewEditTravelStory'
import EmptyCard from '../../components/EmptyCard'
import { DayPicker } from "react-day-picker"
import moment from "moment"
import FilterInfoTitle from "../../components/FilterInfoTitle"
import { getEmptyCardMessage } from "../../utils/helper"

const Home = () => {
  const [ allStories, setAllStories] = useState([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")

  const [dateRange, setDateRange] = useState({ from: null, to: null })

  //console.log(allStories)

  const [ openAddEditMode,setOpenAddEditMode ] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const [ openViewMode, setOpenViewMode ] = useState({
    isShown: false,
    type: "view",
    data: null,
  })

  //all stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/get-all")

      if (response.data && response.data.stories){
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Please try again.")
    }
  }

  //handle edit
  const handleEdit = async (data) => {
    setOpenAddEditMode({isShown: true, type:"edit", data: data})
  }

  const handleViewStory = (data) => {
    setOpenViewMode({isShown: true, data})
  }

  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id

    try {
      const response = await axiosInstance
        .put(
            "/travel-story/update-is-favorite/"+storyId, 
            {
              isFavorite: !storyData.isFavorite
            }
          )

          if(response.data && response.data.story) {
            toast.success("Story Updated")
            getAllTravelStories()
          }
    } catch (error) {
      console.log("Please try again.")
    }
  }

  const deleteTravelStory = async(data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete("/travel-story/delete-story/" + storyId)

      if(response.data && !response.data.error) {
        toast.success("Story deleted ")

        setOpenViewMode((prevState) => ({...prevState, isShown: false}))

        getAllTravelStories()
      }
    } catch (error) {
      console.log("Please try again.")
    }
  }

  const onSearchStory = async(query) => {
    try {
      const response = await axiosInstance.get("/travel-story/search", {
        params: {
          query:query,
        },
      })

      if(response.data && response.data.stories){
        setFilterType("search")
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Please try again.")
    }
  }

  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()
  }

  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: { startDate, endDate },
        })

        if (response.data && response.data.stories) {
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Handle date range click
  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoriesByDate(day)
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(() => {
    getAllTravelStories()

    return () => {}
  }, [])

  return (
    <>
      <Navbar 
        searchQuery = {searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearchNote={onSearchStory} 
        handleClearSearch={handleClearSearch}
      />

      <div className='container mx-auto py-10'>
         <FilterInfoTitle
          filterType={filterType}
          filterDate={dateRange}
          onClear={() => {
            resetFilter()
          }}
        />
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard 
                      key={item._id} 
                      imageUrl={item.imageUrl} 
                      title={item.title} 
                      story={item.story} 
                      date={item.visitedDate}
                      location={item.visitedLocation} 
                      isFavorite = {item.isFavorite} 
                      onEdit={() => handleEdit(item)}
                      onClick={()=>handleViewStory(item)}
                      onFavoriteClick={()=>updateIsFavorite(item)}
                    />
                  )
                })}
              </div>

            ) : (
              <EmptyCard 
                imgSrc={"https://images.pexels.com/photos/15327189/pexels-photo-15327189.jpeg"}
                message = {getEmptyCardMessage(filterType)}
                setOpenAddEditMode = {() => setOpenAddEditMode({
                  isShown: true,
                  type: "add",
                  data: null,
                })}
              />
            )}
          </div>

          <div className="w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={openAddEditMode.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5
        overflow-y-scroll scrollbar z-50"
      >
        <AddEditTravelStory 
          storyInfo={openAddEditMode.data} 
          type={openAddEditMode.type} 
          onClose={() => {
            setOpenAddEditMode({ isShown: false, type: "add", data: null})
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal 
        isOpen={openViewMode.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5
        overflow-y-scroll scrollbar z-50"
        >
          <ViewEditTravelStory 
           type={openViewMode.type}
           storyInfo={openViewMode.data || null}
           onClose={() => {
            setOpenViewMode((prevState) => ({...prevState, isShown: false}))
           }}
           onEditClick={() => {
            setOpenViewMode((prevState) => ({...prevState, isShown:false}))
            handleEdit(openViewMode.data || null)
           }} 
           onDeleteClick={()=>{
            deleteTravelStory(openViewMode.data || null)
           }}
          />
        </Modal>

      <button 
        className='w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 bottom-10' 
        onClick={() => {
          setOpenAddEditMode({ isShown: true, type: "add", data: null })
        }}
      >
        <RiAddLargeFill className='text-[20px] text-white'/>
      </button>

      <ToastContainer />
    </>
  )
}

export default Home