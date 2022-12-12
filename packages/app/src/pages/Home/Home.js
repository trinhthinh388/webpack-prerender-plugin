import React from 'react';
import './styles.css'

import ggBadge from '../../assets/img/google-play-badge.svg'
import appBadge from '../../assets/img/app-store-badge.svg'
import tnwLogo from '../../assets/img/tnw-logo.svg'
import demo from '../../assets/img/demo-screen.mp4'

export default function Home() {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
        id="mainNav"
      >
        <div className="container px-5">
          <a className="navbar-brand fw-bold" href="#page-top">
            Start Bootstrap
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="bi-list" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
              <li className="nav-item">
                <a className="nav-link me-lg-3" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link me-lg-3" href="#download">
                  Download
                </a>
              </li>
            </ul>
            <button
              className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0"
              data-bs-toggle="modal"
              data-bs-target="#feedbackModal"
            >
              <span className="d-flex align-items-center">
                <i className="bi-chat-text-fill me-2" />
                <span className="small">Send Feedback</span>
              </span>
            </button>
          </div>
        </div>
      </nav>
      {/* Mashead header*/}
      <header className="masthead">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-6">
              {/* Mashead text and app badges*/}
              <div className="mb-5 mb-lg-0 text-center text-lg-start">
                <h1 className="display-1 lh-1 mb-3">
                  Showcase your app beautifully.
                </h1>
                <p className="lead fw-normal text-muted mb-5">
                  Launch your mobile app landing page faster with this free,
                  open source theme from Start Bootstrap!
                </p>
                <div className="d-flex flex-column flex-lg-row align-items-center">
                  <a className="me-lg-3 mb-4 mb-lg-0" href="#!">
                    <img
                      className="app-badge"
                      src={ggBadge}
                      alt="..."
                    />
                  </a>
                  <a href="#!">
                    <img
                      className="app-badge"
                      src={appBadge}
                      alt="..."
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {/* Masthead device mockup feature*/}
              <div className="masthead-device-mockup">
                <svg
                  className="circle"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      gradientTransform="rotate(45)"
                    >
                      <stop className="gradient-start-color" offset="0%" />
                      <stop className="gradient-end-color" offset="100%" />
                    </linearGradient>
                  </defs>
                  <circle cx={50} cy={50} r={50} />
                </svg>
                <svg
                  className="shape-1 d-none d-sm-block"
                  viewBox="0 0 240.83 240.83"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="-32.54"
                    y="78.39"
                    width="305.92"
                    height="84.05"
                    rx="42.03"
                    transform="translate(120.42 -49.88) rotate(45)"
                  />
                  <rect
                    x="-32.54"
                    y="78.39"
                    width="305.92"
                    height="84.05"
                    rx="42.03"
                    transform="translate(-49.88 120.42) rotate(-45)"
                  />
                </svg>
                <svg
                  className="shape-2 d-none d-sm-block"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx={50} cy={50} r={50} />
                </svg>
                <div className="device-wrapper">
                  <div
                    className="device"
                    data-device="iPhoneX"
                    data-orientation="portrait"
                    data-color="black"
                  >
                    <div className="screen bg-black">
                      {/* PUT CONTENTS HERE:*/}
                      {/* * * This can be a video, image, or just about anything else.*/}
                      {/* * * Set the max width of your media to 100% and the height to*/}
                      {/* * * 100% like the demo example below.*/}
                      <video
                        muted="muted"
                        autoPlay
                        loop
                        style={{ maxWidth: '100%', height: '100%' }}
                      >
                        <source
                          src={demo}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Quote/testimonial aside*/}
      <aside className="text-center bg-gradient-primary-to-secondary">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-xl-8">
              <div className="h2 fs-1 text-white mb-4">
                "An intuitive solution to a common problem that we all face,
                wrapped up in a single app!"
              </div>
              <img
                src={tnwLogo}
                alt="..."
                style={{ height: '3rem' }}
              />
            </div>
          </div>
        </div>
      </aside>
      {/* App features section*/}
      <section id="features">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-8 order-lg-1 mb-5 mb-lg-0">
              <div className="container-fluid px-5">
                <div className="row gx-5">
                  <div className="col-md-6 mb-5">
                    {/* Feature item*/}
                    <div className="text-center">
                      <i className="bi-phone icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Device Mockups</h3>
                      <p className="text-muted mb-0">
                        Ready to use HTML/CSS device mockups, no Photoshop
                        required!
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-5">
                    {/* Feature item*/}
                    <div className="text-center">
                      <i className="bi-camera icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Flexible Use</h3>
                      <p className="text-muted mb-0">
                        Put an image, video, animation, or anything else in the
                        screen!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-5 mb-md-0">
                    {/* Feature item*/}
                    <div className="text-center">
                      <i className="bi-gift icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Free to Use</h3>
                      <p className="text-muted mb-0">
                        As always, this theme is free to download and use for
                        any purpose!
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* Feature item*/}
                    <div className="text-center">
                      <i className="bi-patch-check icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Open Source</h3>
                      <p className="text-muted mb-0">
                        Since this theme is MIT licensed, you can use it
                        commercially!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 order-lg-0">
              {/* Features section device mockup*/}
              <div className="features-device-mockup">
                <svg
                  className="circle"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      gradientTransform="rotate(45)"
                    >
                      <stop className="gradient-start-color" offset="0%" />
                      <stop className="gradient-end-color" offset="100%" />
                    </linearGradient>
                  </defs>
                  <circle cx={50} cy={50} r={50} />
                </svg>
                <svg
                  className="shape-1 d-none d-sm-block"
                  viewBox="0 0 240.83 240.83"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="-32.54"
                    y="78.39"
                    width="305.92"
                    height="84.05"
                    rx="42.03"
                    transform="translate(120.42 -49.88) rotate(45)"
                  />
                  <rect
                    x="-32.54"
                    y="78.39"
                    width="305.92"
                    height="84.05"
                    rx="42.03"
                    transform="translate(-49.88 120.42) rotate(-45)"
                  />
                </svg>
                <svg
                  className="shape-2 d-none d-sm-block"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx={50} cy={50} r={50} />
                </svg>
                <div className="device-wrapper">
                  <div
                    className="device"
                    data-device="iPhoneX"
                    data-orientation="portrait"
                    data-color="black"
                  >
                    <div className="screen bg-black">
                      {/* PUT CONTENTS HERE:*/}
                      {/* * * This can be a video, image, or just about anything else.*/}
                      {/* * * Set the max width of your media to 100% and the height to*/}
                      {/* * * 100% like the demo example below.*/}
                      <video
                        muted="muted"
                        autoPlay
                        loop
                        style={{ maxWidth: '100%', height: '100%' }}
                      >
                        <source
                          src={demo}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Basic features section*/}
      <section className="bg-light">
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5">
              <h2 className="display-4 lh-1 mb-4">
                Enter a new age of web design
              </h2>
              <p className="lead fw-normal text-muted mb-5 mb-lg-0">
                This section is perfect for featuring some information about
                your application, why it was built, the problem it solves, or
                anything else! There's plenty of space for text here, so don't
                worry about writing too much.
              </p>
            </div>
            <div className="col-sm-8 col-md-6">
              <div className="px-5 px-sm-0">
                <img
                  className="img-fluid rounded-circle"
                  src="https://source.unsplash.com/u8Jn2rzYIps/900x900"
                  alt="..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to action section*/}
      <section className="cta">
        <div className="cta-content">
          <div className="container px-5">
            <h2 className="text-white display-1 lh-1 mb-4">
              Stop waiting.
              <br />
              Start building.
            </h2>
            <a
              className="btn btn-outline-light py-3 px-4 rounded-pill"
              href="https://startbootstrap.com/theme/new-age"
              target="_blank"
            >
              Download for free
            </a>
          </div>
        </div>
      </section>
      {/* App badge section*/}
      <section className="bg-gradient-primary-to-secondary" id="download">
        <div className="container px-5">
          <h2 className="text-center text-white font-alt mb-4">
            Get the app now!
          </h2>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center">
            <a className="me-lg-3 mb-4 mb-lg-0" href="#!">
              <img
                className="app-badge"
                src={ggBadge}
                alt="..."
              />
            </a>
            <a href="#!">
              <img
                className="app-badge"
                src={appBadge}
                alt="..."
              />
            </a>
          </div>
        </div>
      </section>
      {/* Footer*/}
      <footer className="bg-black text-center py-5">
        <div className="container px-5">
          <div className="text-white-50 small">
            <div className="mb-2">
              © Your Website 2021. All Rights Reserved.
            </div>
            <div className="mb-2">
              Distributed by{' '}
              <a href="https://themewagon.com/" target="_blank">
                Themewagon
              </a>
            </div>
            <a href="#!">Privacy</a>
            <span className="mx-1">·</span>
            <a href="#!">Terms</a>
            <span className="mx-1">·</span>
            <a href="#!">FAQ</a>
          </div>
        </div>
      </footer>
      {/* Feedback modal*/}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex={-1}
        aria-labelledby="feedbackModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-gradient-primary-to-secondary p-4">
              <h5
                className="modal-title font-alt text-white"
                id="feedbackModalLabel"
              >
                Send feedback
              </h5>
              <button
                className="btn-close btn-close-white"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body border-0 p-4">
              <form>
                <div className="form-floating mb-4">
                  <input
                    className="form-control"
                    id="inputName"
                    type="text"
                    placeholder="Enter your name..."
                  />
                  <label htmlFor="inputName">Name</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="email"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="inputEmail">Email address</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    className="form-control"
                    id="inputPhone"
                    type="tel"
                    placeholder="(123) 456-7890"
                  />
                  <label htmlFor="inputPhone">Phone number</label>
                </div>
                <div className="form-floating mb-4">
                  <textarea
                    className="form-control"
                    id="inputMessage"
                    placeholder="Enter your message here..."
                    style={{ height: '10rem' }}
                    defaultValue={''}
                  />
                  <label htmlFor="inputMessage">Message</label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary rounded-pill py-3"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
