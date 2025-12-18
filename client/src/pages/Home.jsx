import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category'
import Featured from '../components/Featured'
import BrandPatners from '../components/BrandPatners'
import TestimonialReviews from '../components/TestimonialReviews'
import NewsletterCTA from '../components/NewsLetterCTA'

const Home = () => {
  return (
    <div>
      <Header/>
      <Category/>
      <Featured/>
      <BrandPatners/>
      <TestimonialReviews/>
    </div>
  )
}

export default Home