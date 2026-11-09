'use client';


export default function UserDetails({ userId }) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <p>User ID: {userId}</p>
        {/* You can add more user details here */}
      </div>
    );
}
  