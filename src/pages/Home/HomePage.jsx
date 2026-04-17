import { useNavigate } from "react-router-dom"
import FeedPost from "../../components/ui/FeedPost"
import { useUserContext } from "../../context/userContext"
import { useEffect, useState } from "react"
import apiCall from "../../services/apiCall"
import PageLoader from "../../components/ui/PageLoader"
import EmptyState from "../../components/ui/EmptyState"
import { FaInbox } from "react-icons/fa"

function HomePage() {
  const navigate = useNavigate()
  const { userProfile, loading, setLoading } = useUserContext()
  const [feedData, setFeedData] = useState([])

  useEffect(() => {
    const populateFeed = async () => {
      const response = await apiCall.getFeed(setLoading)
      setFeedData(response?.data || [])
    }
    populateFeed()
  }, [])

  return (
    <div className="flex flex-col gap-6 px-4 lg:mx-50 py-8">
      {loading ? (
        <PageLoader text="Loading your feed..." />
      ) : feedData.length === 0 ? (
        <EmptyState
          icon={FaInbox}
          title="Feed is Empty"
          message="There are no posts to display right now. Check back later or ask a new question!"
          actionButton={
            <button
              onClick={() => (userProfile?.username ?
                navigate("/ask") :
                navigate("/register")
              )}
              className="btn-primary mt-4"
            >
              {userProfile?.username ? "Ask a Question" : "Sign Up"}
            </button>
          }
        />)
        : (
          feedData.map((currPost, index) => {
            return <FeedPost key={currPost.postId} post={currPost} index={index} />
          })
        )}
    </div>
  )
}

export default HomePage