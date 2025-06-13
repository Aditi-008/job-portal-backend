import React from 'react';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  const { appliedJobs } = useSelector((state) => state.job);

  // Safe guard
  if (!appliedJobs || appliedJobs.length === 0) {
    return <div>No applied jobs found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Date Applied</th>
          </tr>
        </thead>
        <tbody>
          {appliedJobs.map((job) => (
            <tr key={job._id}>
              <td className="px-4 py-2 border">{job.companyName}</td>
              <td className="px-4 py-2 border">{job.jobTitle}</td>
              <td className="px-4 py-2 border">{job.createdAt.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobTable;
