import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import FeedPost from "../../components/ui/FeedPost"
import PageLoader from "../../components/ui/PageLoader"
import EmptyState from "../../components/ui/EmptyState"
import HomeSidebar from "./HomeSidebar"
import { FaInbox } from "react-icons/fa"

function HomePage() {
  const navigate = useNavigate()
  const { userProfile } = useUserContext()
  const [feedData, setFeedData] = useState([])
  const [loading, setLoading] = useState()

  useEffect(() => {
    const populateFeed = async () => {
      const response = await apiCall.getFeed(setLoading, setFeedData)
    }
    populateFeed()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Feed — 70% */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Sort tabs (UI-only for now) */}
          <div className="flex gap-6 border-b border-gray-200 pb-3 mb-2">
            {["Newest", "Most Voted", "Unanswered"].map((tab, i) => (
              <button
                key={tab}
                className={`text-sm font-semibold pb-1 transition-colors cursor-not-allowed ${i === 0
                  ? "text-brand-600 border-b-2 border-brand-500"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
                disabled={true}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* loading state inactive before react can populate feedData */}
          {loading ? (
            <PageLoader text="Loading your feed..." />
          ) : feedData.length === 0 ? (
            <EmptyState
              icon={FaInbox}
              title="Feed is Empty"
              message="There are no posts to display right now. Check back later or ask a new question!"
              actionButton={
                <button
                  onClick={() => (userProfile?.username
                    ? navigate("/ask")
                    : navigate("/register")
                  )}
                  className="btn-primary mt-4"
                >
                  {userProfile?.username ? "Ask a Question" : "Sign Up"}
                </button>
              }
            />
          ) : (
            feedData.map((currPost) => (
              <FeedPost key={currPost.postId} post={currPost} />
            ))
          )}
        </div>

        {/* Sidebar — 30% (hidden on mobile) */}
        <div className="hidden lg:block w-80 shrink-0">
          <HomeSidebar />
        </div>
      </div>

      {/* Mobile FAB for ask question */}
      {userProfile?.username && (
        <button
          onClick={() => navigate("/ask")}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-600
                        text-white text-2xl font-bold rounded-full shadow-lg
                        flex items-center justify-center transition-all active:scale-95 cursor-pointer z-40"
          aria-label="Ask a question"
        >
          +
        </button>
      )}
    </div>
  )
}

export default HomePage