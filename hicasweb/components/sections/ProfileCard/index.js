import Profile from "./profile"

const ProfileCards = ({ data }) => {
  return (
    <div className="container">
      <Profile title={data.title} cards={data.cards} />
    </div>
  )
}

export default ProfileCards
