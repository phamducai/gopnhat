import NextImage from "@/components/elements/image"

const Profile = ({ title, cards }) => {
  return (
    <div>
      <p className="Font-Styles-Title-Global">{title}</p>

      <div className="max-w-screen-xl mx-auto grid gap-1 lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-2 justify-center">
        {cards.map((p) => (
          <div key={p.id} style={{ maxHeight: "230px" }}>
            <NextImage media={p.image} width={340} height={230} />
            <div
              style={{
                position: "relative",
                top: "-30%",
              }}
            >
              <p
                style={{
                  fontFamily: "Roboto,sans-serif",
                  fontWeight: "500",
                  padding: "0 10px",
                  fontSize: "16px",
                  lineHeight: "21px",
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                {p.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
