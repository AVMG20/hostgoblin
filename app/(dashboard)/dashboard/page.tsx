export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Manage your content from here.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Categories</h3>
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            Total categories
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Products</h3>
          </div>
          <div className="text-2xl font-bold">45</div>
          <p className="text-xs text-muted-foreground">
            Total products
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Posts</h3>
          </div>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">
            Published posts
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Views</h3>
          </div>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">
            This month
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/dashboard/categories/create" className="block text-sm text-blue-600 hover:text-blue-800">
              + Add New Category
            </a>
            <a href="/dashboard/posts/create" className="block text-sm text-blue-600 hover:text-blue-800">
              + Create New Post
            </a>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Activity</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>New category "Electronics" created</p>
            <p>Post "Getting Started" published</p>
            <p>Product "Laptop" updated</p>
          </div>
        </div>
      </div>
    </div>
  )
}