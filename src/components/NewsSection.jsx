import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  collection, getDocs, addDoc, updateDoc, doc,
  arrayUnion, arrayRemove, query, where, serverTimestamp,
} from 'firebase/firestore'
import {
  FaSearch, FaHeart, FaComment, FaCalendar, FaUser,
  FaTimes, FaPaperPlane, FaEnvelopeOpenText, FaLock,
  FaNewspaper, FaSort,
} from 'react-icons/fa'
import SectionHeader from './SectionHeader'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

const fmt = (ts) => {
  if (!ts) return '—'
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ArticleModal({ post, posts, setPosts, currentUser, onClose }) {
  const livePost = posts.find(p => p.id === post.id) || post
  const isLiked = (livePost.likedBy || []).includes(currentUser?.uid)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getDocs(query(collection(db, 'news_comments'), where('postId', '==', post.id)))
      .then(snap => {
        const c = snap.docs.map(d => ({ ...d.data(), id: d.id }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setComments(c)
        setLoadingComments(false)
      })
      .catch(() => setLoadingComments(false))
  }, [post.id])

  const toggleLike = async () => {
    if (!currentUser) return
    const ref = doc(db, 'news', post.id)
    const already = isLiked
    setPosts(prev => prev.map(p => p.id === post.id
      ? { ...p, likedBy: already ? (p.likedBy || []).filter(u => u !== currentUser.uid) : [...(p.likedBy || []), currentUser.uid] }
      : p
    ))
    try {
      await updateDoc(ref, { likedBy: already ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) })
    } catch {
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, likedBy: already ? [...(p.likedBy || []), currentUser.uid] : (p.likedBy || []).filter(u => u !== currentUser.uid) }
        : p
      ))
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !currentUser) return
    setSubmitting(true)
    try {
      const data = {
        postId: post.id,
        text: commentText.trim(),
        authorName: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      }
      const ref = await addDoc(collection(db, 'news_comments'), data)
      setComments(prev => [{ ...data, id: ref.id, createdAt: { seconds: Date.now() / 1000 } }, ...prev])
      setCommentText('')
    } catch {}
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <span className="bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {livePost.category}
          </span>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {livePost.image && (
            <div className="h-56 overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={livePost.image} alt={livePost.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="px-6 py-5">
            <h2 className="text-2xl font-bold text-dark-green mb-2 leading-tight">{livePost.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
              {livePost.author && (
                <span className="flex items-center gap-1"><FaUser size={10} /> {livePost.author}</span>
              )}
              <span className="flex items-center gap-1"><FaCalendar size={10} /> {fmt(livePost.createdAt)}</span>
            </div>
            {livePost.excerpt && (
              <p className="text-gray-500 text-sm italic mb-5 leading-relaxed border-l-4 border-secondary/30 pl-4">{livePost.excerpt}</p>
            )}
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{livePost.content}</div>
          </div>

          {/* Likes + Comments */}
          <div className="px-6 pb-8">
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-5 mb-6">
                {currentUser ? (
                  <button onClick={toggleLike}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                    <FaHeart /> {(livePost.likedBy || []).length} {isLiked ? 'Liked' : 'Like'}
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FaHeart /> {(livePost.likedBy || []).length}
                    <span className="text-xs ml-1 flex items-center gap-1 text-gray-300">
                      <FaLock size={9} /> Login to like
                    </span>
                  </span>
                )}
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <FaComment size={12} /> {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Comments list */}
              <div className="space-y-3 mb-5">
                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span className="font-semibold text-dark-green">{c.authorName}</span>
                        <span>{fmt(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment form — login-gated */}
              {currentUser ? (
                <form onSubmit={submitComment} className="space-y-2">
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                    placeholder="Write a comment…" required rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary resize-none" />
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 bg-secondary hover:bg-tertiary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                    <FaPaperPlane size={11} /> {submitting ? 'Posting…' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <FaLock className="text-gray-300 text-xl mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    <Link to="/login" className="text-secondary font-semibold hover:underline">Log in</Link>{' '}
                    to like and comment on this post.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsSection() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [searchQ, setSearchQ] = useState('')
  const [articlePost, setArticlePost] = useState(null)
  const [subName, setSubName] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [subStatus, setSubStatus] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!db) { setLoading(false); return }
    getDocs(collection(db, 'news'))
      .then(snap => {
        const list = snap.docs
          .map(d => ({ ...d.data(), id: d.id }))
          .filter(p => p.published)
        setPosts(list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = [...posts]
    .filter(p => !searchQ ||
      p.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQ.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      if (sortBy === 'most-liked') return (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
      return 0
    })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!subEmail.trim()) return
    setSubscribing(true)
    try {
      await addDoc(collection(db, 'subscribers'), {
        name: subName.trim(),
        email: subEmail.trim(),
        source: 'news_section',
        createdAt: serverTimestamp(),
      })
      setSubStatus('success')
      setSubName('')
      setSubEmail('')
    } catch {
      setSubStatus('error')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Latest News & Farm Updates"
          subtitle="Stay updated with our farm activities, tips, and agricultural insights"
        />

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaNewspaper className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>News & updates coming soon. Check back later!</p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search news and updates..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
              </div>
              <div className="flex items-center gap-2">
                <FaSort className="text-gray-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-secondary bg-white">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-liked">Most Liked</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No articles match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filtered.map(post => (
                  <div key={post.id}
                    onDoubleClick={() => setArticlePost(post)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group reveal">
                    <div className="h-48 overflow-hidden bg-gray-100">
                      {post.image ? (
                        <img src={post.image} alt={post.title} loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <FaNewspaper size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {post.category}
                      </span>
                      <h3 className="font-bold text-dark-green text-lg mb-2 leading-snug">{post.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                        {post.author && (
                          <span className="flex items-center gap-1"><FaUser size={10} /> {post.author}</span>
                        )}
                        <span className="flex items-center gap-1"><FaCalendar size={10} /> {fmt(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <FaHeart size={12} /> {(post.likedBy || []).length}
                        </span>
                        <button onClick={() => setArticlePost(post)}
                          className="text-xs text-secondary font-semibold hover:underline">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter */}
        <div className="bg-dark-green text-white rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center reveal">
          <FaEnvelopeOpenText className="text-secondary text-3xl mb-4 mx-auto" />
          <h4 className="text-2xl font-bold mb-2">Get Weekly Updates</h4>
          <p className="text-gray-300 mb-6">Join our farming community and receive weekly tips, news, and exclusive offers.</p>
          {subStatus === 'success' ? (
            <p className="text-green-400 font-semibold">✓ Subscribed! Thank you for joining AgriGloria's community.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input value={subName} onChange={e => setSubName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-secondary text-sm" />
              <div className="flex gap-2">
                <input type="email" value={subEmail} onChange={e => setSubEmail(e.target.value)}
                  placeholder="Your email address" required
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-secondary text-sm" />
                <button type="submit" disabled={subscribing}
                  className="bg-secondary hover:bg-tertiary text-white px-5 py-3 rounded-lg font-semibold text-sm transition-colors">
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </div>
              {subStatus === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
              )}
              <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                <FaLock size={10} /> We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>

      {articlePost && (
        <ArticleModal
          post={articlePost}
          posts={posts}
          setPosts={setPosts}
          currentUser={currentUser}
          onClose={() => setArticlePost(null)}
        />
      )}
    </section>
  )
}
