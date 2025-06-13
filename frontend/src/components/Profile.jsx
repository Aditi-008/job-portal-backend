import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { loading, error } = useGetAppliedJobs();
  const allAppliedJobs = useSelector((store) => store.job.allAppliedJobs);

  return (
    <div>
      <Navbar />

      {/* Profile Info */}
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src='https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
                alt='profile'
              />
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.bio || 'No bio available.'}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className='text-right' variant='outline'>
            <Pen />
          </Button>
        </div>

        {/* Contact Info */}
        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* Skills */}
        <div className='my-5'>
          <h1 className='font-semibold text-md mb-2'>Skills</h1>
          <div className='flex items-center gap-1 flex-wrap'>
            {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label className='text-md font-bold'>Resume</Label>
          {isResume && user?.profile?.resume ? (
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={user.profile.resume}
              className='text-blue-500 w-full hover:underline cursor-pointer'
            >
              {user.profile.resumeOriginalName || 'View Resume'}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className='max-w-4xl mx-auto bg-white rounded-2xl p-4'>
        <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>

        {loading && <p>Loading applied jobs...</p>}

        {error && <p className='text-red-500'>{error}</p>}

        {!loading && !error && Array.isArray(allAppliedJobs) && allAppliedJobs.length === 0 && (
          <p className='text-gray-500'>No applied jobs found.</p>
        )}

        {!loading && Array.isArray(allAppliedJobs) && allAppliedJobs.length > 0 && (
          <div className='space-y-3'>
            {allAppliedJobs.map((app) => (
              <div key={app._id} className='border p-4 rounded shadow'>
                <h2 className='font-semibold'>{app.job?.title || 'Untitled Job'}</h2>
                <p>{app.job?.description?.slice(0, 100)}...</p>
                <p className='text-sm text-gray-500'>
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
