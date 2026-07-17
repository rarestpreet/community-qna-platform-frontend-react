import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/userContext"
import apiCall from "../../services/apiCall"
import FeedPost from "../../components/ui/FeedPost"
import PageLoader from "../../components/ui/PageLoader"
import EmptyState from "../../components/ui/EmptyState"
import LeftSidebar from "./LeftSidebar"
import HomeRightSidebar from "./HomeRightSidebar"
import { FaInbox, FaFilter, FaPlusCircle } from "react-icons/fa"
import { MdForum } from "react-icons/md"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

function HomePage() {
  const navigate = useNavigate()
  const { userProfile } = useUserContext()
  const [feedData, setFeedData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [limit] = useState(5)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useEffect(() => {
    const fetchInitialFeed = async () => {
      setLoading(true)
      const response = await apiCall.getFeed(limit, 0)
      if (response && response.data) {
        setFeedData(response.data)
        setHasMore(response.pageData.hasMore)
        setOffset(limit) // next offset
      }
      setLoading(false)
    }
    fetchInitialFeed()
  }, [limit])

  const loadMore = async () => {
    setIsFetchingMore(true)
    const response = await apiCall.getFeed(limit, offset)
    if (response && response.data) {
      setFeedData(prev => [...prev, ...response.data])
      setHasMore(response.pageData.hasMore)
      setOffset(prev => prev + limit)
    }
    setIsFetchingMore(false)
  }

  useInfiniteScroll(loadMore, hasMore, isFetchingMore)

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full flex flex-col lg:flex-row min-h-screen">
            {/* Left Sidebar */}
            <LeftSidebar />
            
            <div className="flex-1 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 py-8 w-full lg:ml-64">
                {/* Main Feed (70%) */}
                <div className="flex-1 lg:max-w-[70%]">
                
                {/* Hero Welcome - temporarily hidden
                <section className="mb-8 p-6 bg-surface rounded-xl border border-surface-container shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <MdForum className="text-9xl text-on-surface" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                            Hello, {userProfile?.username || 'Developer'}
                        </h1>
                        <p className="text-on-surface-variant max-w-lg mb-6">
                            Your dashboard is up to date. Explore new error reports in your specialized areas or share your knowledge.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => userProfile?.username ? navigate("/ask") : navigate("/register")}
                                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
                            >
                                Ask New Error Report
                            </button>
                            <button className="px-6 py-2.5 bg-surface-container-low text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all active:scale-95 cursor-not-allowed opacity-60">
                                View Analytics
                            </button>
                        </div>
                    </div>
                </section>
                */}

                {/* Feed Filter Tabs */}
                <div className="flex items-center justify-between mb-6 border-b border-surface-container pb-2">
                    <div className="flex gap-6 overflow-x-auto custom-scrollbar whitespace-nowrap">
                        {["All Reports"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`font-bold pb-2 transition-colors ${i === 0
                                ? "text-primary border-b-2 border-primary"
                                : "text-on-surface-variant hover:text-on-surface cursor-not-allowed opacity-60"
                                }`}
                                disabled={i !== 0}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-body-sm transition-colors cursor-not-allowed opacity-60">
                        <FaFilter className="text-xs" />
                        Filter
                    </button>
                </div>

                    {/* Feed Loading / Empty / Content */}
                    <div className="flex flex-col gap-4 min-w-0 pb-10">
                        {loading ? (
                            <div className="bg-surface border border-surface-container rounded-xl p-5 space-y-4 opacity-50 shadow-sm animate-pulse">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="h-5 w-16 bg-surface-container rounded"></div>
                                        <div className="h-5 w-24 bg-surface-container rounded"></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-8 w-10 bg-surface-container rounded"></div>
                                        <div className="h-8 w-10 bg-surface-container rounded"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-3/4 bg-surface-container rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-surface-container rounded"></div>
                                    <div className="h-4 w-5/6 bg-surface-container rounded"></div>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-6 bg-surface-container rounded-full"></div>
                                        <div className="h-4 w-20 bg-surface-container rounded"></div>
                                    </div>
                                    <div className="h-6 w-6 bg-surface-container rounded"></div>
                                </div>
                            </div>
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
                                        className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-brand-700 transition-all active:scale-95 shadow-sm mt-4"
                                    >
                                        {userProfile?.username ? "Ask a Question" : "Sign Up"}
                                    </button>
                                }
                            />
                        ) : (
                            <>
                                {feedData.map(post => (
                                    <FeedPost key={post.navigationId || post.postId} post={post} />
                                ))}
                                {isFetchingMore && (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <HomeRightSidebar />
            </div>
        </main>
        
        {/* Mobile FAB */}
        {userProfile?.username && (
            <button
                onClick={() => navigate("/ask")}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-brand-700
                            text-white text-2xl font-bold rounded-full shadow-lg
                            flex items-center justify-center transition-all active:scale-95 cursor-pointer z-40"
                aria-label="Ask a question"
            >
                <FaPlusCircle />
            </button>
        )}
    </div>
  )
}

export default HomePage