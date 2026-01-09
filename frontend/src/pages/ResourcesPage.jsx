import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ExternalLinkIcon, BookOpenIcon, UserIcon, CalendarIcon } from "lucide-react";

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
  }, [searchQuery, resources]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const ResourceCard = ({ resource }) => (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300 overflow-hidden"
    >
      {resource.coverImage && (
        <figure className="h-40 overflow-hidden bg-base-200">
          <img
            src={resource.coverImage}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title text-lg line-clamp-2">{resource.title}</h2>
        
        <p className="text-sm text-base-content/70 line-clamp-2">
          {resource.description}
        </p>

        <div className="space-y-2 text-xs text-base-content/60">
          <div className="flex items-center gap-2">
            <UserIcon className="size-3" />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-3" />
            <span>{formatDate(resource.publishDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="size-3" />
            <span>{resource.readTime} min read</span>
          </div>
        </div>

        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="badge badge-sm badge-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm gap-2">
            Read More
            <ExternalLinkIcon className="size-4" />
          </button>
        </div>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Coding Resources</h1>
          <p className="text-base-content/70">
            Discover free tutorials, articles, and learning materials to level up your coding skills
          </p>
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-8 bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
          <label className="block text-sm font-semibold mb-2 text-base-content">
            Search Resources
          </label>
          <input
            type="text"
            placeholder="Search by title, topic, or tag..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* RESOURCES GRID */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-base-content/70">Fetching resources...</p>
            </div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body text-center">
              <p className="text-base-content/60 mb-4">
                No resources found. Try adjusting your search query.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-primary btn-sm"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
