import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ExternalLinkIcon, BookOpenIcon, UserIcon, CalendarIcon } from "lucide-react";

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch resources from Dev.to API
  const fetchResources = async () => {
    try {
      setLoading(true);
      // Use the latest/trending articles endpoint which is more reliable
      const response = await fetch(
        "https://dev.to/api/articles?per_page=60&top=7"
      );
      const data = await response.json();
      
      console.log("API Response:", data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Map all articles
        const codingResources = data
          .slice(0, 50)
          .map((article) => ({
            id: article.id,
            title: article.title,
            description: article.description || article.excerpt || "No description available",
            author: article.user?.name || "Unknown Author",
            authorImage: article.user?.profile_image_90,
            tags: article.tag_list || [],
            link: article.url,
            readTime: article.reading_time_minutes || 5,
            publishDate: new Date(article.published_at),
            coverImage: article.cover_image,
          }))
          .filter((resource) => resource.title && resource.link); // Only filter out incomplete data

        console.log("Mapped resources:", codingResources);
        
        if (codingResources.length > 0) {
          setResources(codingResources);
        } else {
          console.warn("No resources found after filtering", data);
        }
      } else {
        console.warn("No data from API", data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources based on search
  useEffect(() => {
    let filtered = resources;

    // Filter by search query
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description?.toLowerCase().includes(searchLower) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, resources]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  const ResourceCard = ({ resource }) => (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white shadow-sm hover:shadow-md transition-all border border-black/10 hover:border-[#451a21]/30 overflow-hidden rounded-lg"
    >
      {resource.coverImage && (
        <div className="h-40 overflow-hidden bg-black/5">
          <img
            src={resource.coverImage}
            alt={resource.title}
            className="w-full h-full object-cover transition-all"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-lg font-serif font-medium text-[#451a21] line-clamp-2 mb-3">{resource.title}</h2>
        
        <p className="text-sm text-black/60 font-light line-clamp-2 mb-4">
          {resource.description}
        </p>

        <div className="space-y-2 text-xs text-black/60 font-light mb-4">
          <div className="flex items-center gap-2">
            <UserIcon className="size-3 text-[#451a21]" />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-3 text-[#451a21]" />
            <span>{formatDate(resource.publishDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="size-3 text-[#451a21]" />
            <span>{resource.readTime} min read</span>
          </div>
        </div>

        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-[#d4af37]/20 text-[#451a21] text-[9px] font-bold tracking-wider uppercase rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-[#451a21] hover:bg-[#d4af37] text-white text-[10px] font-bold tracking-wider uppercase transition-all rounded flex items-center gap-2">
            Read More
            <ExternalLinkIcon className="size-4" />
          </button>
        </div>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-12 border-b border-black/5 pb-8">
          <h1 className="text-5xl font-serif font-light text-[#451a21] tracking-tight mb-2">Coding Resources</h1>
          <p className="text-lg text-black/60 font-light">
            Discover free tutorials, articles, and learning materials to level up your coding skills
          </p>
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-black/10">
          <label className="block text-[10px] font-bold tracking-wider uppercase mb-2 text-[#451a21]">
            Search Resources
          </label>
          <input
            type="text"
            placeholder="Search by title, topic, or tag..."
            className="w-full px-4 py-2 border border-black/10 rounded focus:outline-none focus:border-[#451a21] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* RESOURCES GRID */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="size-16 border-4 border-[#451a21]/20 border-t-[#451a21] rounded-full animate-spin mb-4"></div>
              <p className="text-black/60 font-light">Fetching resources...</p>
            </div>
          </div>
        ) : filteredResources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-black/20 hover:border-[#451a21]/30 text-[10px] font-bold tracking-wider uppercase transition-all rounded disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-[10px] font-bold tracking-wider uppercase transition-all rounded ${
                        currentPage === page 
                          ? "bg-[#451a21] text-white" 
                          : "bg-white border border-black/20 hover:border-[#451a21]/30 text-black/70"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-black/20 hover:border-[#451a21]/30 text-[10px] font-bold tracking-wider uppercase transition-all rounded disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white shadow-sm border border-black/5 rounded-lg p-8 text-center">
            <p className="text-black/50 font-light mb-4">
              No resources found. Try adjusting your search query.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2 bg-[#451a21] hover:bg-[#d4af37] text-white text-[10px] font-bold tracking-wider uppercase transition-all rounded"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
