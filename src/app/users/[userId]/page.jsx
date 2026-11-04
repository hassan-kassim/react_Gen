import UserDetails from '../../pages/users/userDetails';

export default async function UserPage({ params }) {
  const { userId } = await params;

  return <UserDetails userId={userId} />;
}
