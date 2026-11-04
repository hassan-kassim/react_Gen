'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useUserActions } from '../../../state/dispatchers/useUserActions';
import { useSelector } from 'react-redux';
import { selectAllUsers, selectUsersLoading, selectUsersError, selectTotalUsersCount } from '../../../state/selectors/userSelectors';

export default function Users() {
  // 1. Consume clean, functional selectors
  const users = useSelector(selectAllUsers);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const totalCount = useSelector(selectTotalUsersCount);

  const { fetchUsers } = useUserActions();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        
        {/* Navigation Head */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
          <div>
            <div className="mb-2">
              <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 hover:underline">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">System Users Directory</h1>
            <p className="text-sm text-gray-500">A live index of all registered account profiles fetched via Axios.</p>
          </div>
          
          <div className="text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md self-start sm:self-center">
            Total Records: <span className="text-indigo-600 font-bold">{totalCount}</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700 rounded-r-md">
            {error}
          </div>
        )}

        {/* Conditional States UI: Loading skeleton vs Data Table */}
        {isLoading ? (
          <div className="space-y-4 py-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-100 rounded w-full"></div>
            <div className="h-12 bg-gray-100 rounded w-full"></div>
            <div className="h-12 bg-gray-100 rounded w-full"></div>
          </div>
        ) : users.length === 0 && !error ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No system users were found in the network dataset.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 font-semibold text-gray-700">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-gray-900">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link href={`/users/${user.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center uppercase shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-900">{user.name}</span>
                          <span className="block text-xs text-gray-400 font-normal">{user.email}</span>
                        </div>
                      </div>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500">
                        @{user.username.toLowerCase()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {user.company}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {user.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
