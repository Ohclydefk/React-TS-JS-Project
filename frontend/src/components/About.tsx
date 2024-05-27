import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Navbar from "./Navbar";

function About() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number, e: any) => {
    setIndex(selectedIndex);
  };

  return (
    <body>
      <Navbar />
      <div className="container custom-carousel-container">
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          className="rounded"
          style={{ overflow: "hidden", borderRadius: "50px" }}
        >
          <Carousel.Item>
            <img
              src="/src/assets/goats.jpg"
              className="d-block w-100 carousel-image"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              src="/src/assets/goated2.png"
              className="d-block w-100 carousel-image"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              src="/src/assets/goated2.jpg"
              className="d-block w-100 carousel-image"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      <main className="mt-5">
        <div className="container">
          <section>
            <div className="row">
              <div className="col-md-6 gx-5 mb-4">
                <div
                  className="bg-image hover-overlay ripple shadow-2-strong"
                  data-mdb-ripple-color="light"
                >
                  <img
                    src="/src/assets/goatmez.png"
                    className="img-fluid about-logo-circle"
                    alt="Placeholder"
                  />
                  <a href="#!">
                    <div
                      className="mask"
                      style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                    ></div>
                  </a>
                </div>
              </div>

              <div className="col-md-6 gx-5 mb-4">
                <h4 className="fw-bold" style={{ textAlign: "justify" }}>
                  Welcome to Goatmez, the ultimate social networking platform
                  where the world comes together to celebrate the charm and
                  majesty of G.O.A.T'S! 🐐
                </h4>
                <br />
                <p className="text-muted" style={{ textAlign: "justify" }}>
                  Join Goatmez today and be part of a community that understands
                  the unique and wonderful world of goats. Whether you're a
                  seasoned goat owner or simply admire these charming animals
                  from afar, Goatmez is the place to be for all things
                  goat-tastic! 🎉🐐 <strong>#GoatLove #GoatmezCommunity</strong>
                </p>
                <br />
                <p className="fw-bold" style={{ fontSize: "24px" }}>
                  Goatmez Community:
                </p>
                <p
                  className="text-muted text-justify"
                  style={{ textAlign: "justify" }}
                >
                  Goatmez aims to be more than just a platform; it's a
                  supportive community where users can seek advice, share their
                  achievements, and find encouragement from fellow G.O.A.T'S.
                  Whether you're a human, goat, or etc., Goatmez welcomes
                  everyone with open arms.
                </p>
              </div>
            </div>
          </section>
        </div>
        <br />
      </main>
    </body>
  );
}

export default About;
