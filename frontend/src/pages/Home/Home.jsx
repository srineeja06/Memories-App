import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'

const Home = () => {
  const [ allStories, setAllStories] = useState([])

  console.log(allStories)
  
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

  useEffect(() => {
    getAllTravelStories()

    return () => {}
  }, [])

  return (
    <>
      <Navbar />

      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
          <div className='flex-1'></div>

          <div className='w-[320px]'></div>
        </div>
      </div>
    </>
  )
}

export default Home