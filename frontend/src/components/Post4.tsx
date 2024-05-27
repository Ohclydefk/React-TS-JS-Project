function Post4() {
  return (
    <div>
      <hr
        style={{
          width: "1000px",
          marginLeft: "150px",
          height: "5px",
          border: "none",
          backgroundColor: "black",
        }}
      />
      {/* Profile Post Tab */}
      <div className="tab-pane fade active show" id="profile-post">
        {/* Your existing posts content goes here */}
        <ul className="timeline">
          {/* Timeline Item 1 */}
          <li>
            {/* Timeline Body */}
            <div className="timeline-body">
              {/* Timeline Header */}
              <div className="timeline-header">
                <span className="userimage">
                  <img src="/src/assets/gerger2.jpg" alt="" />
                </span>
                <span className="username">
                  <a href="javascript:;">Gerry Betita III</a> <small></small>
                </span>
                <button
                  type="button"
                  className="btn-link menu-custom-button1"
                  title="More Options"
                >
                  <i className="fa fa-ellipsis-h"></i>
                </button>
              </div>
              {/* Timeline Content */}
              <div className="timeline-content">
                <p>
                  Loyal Since 2014.. #RoyalGustoKoUminomNgRoyal #AyEsteLoyalPala
                </p>
                <div className="imagepost">
                  <img src="/src/assets/gerger.jpg" alt="" />
                </div>
              </div>
              {/* Timeline Likes */}
              <div className="timeline-likes">
                <div className="stats-right">
                  <span className="stats-text">10K Shares</span>
                  <span className="stats-text">2M Comments</span>
                </div>
                <div className="stats">
                  <span className="fa-stack fa-fw stats-icon">
                    <i className="fa fa-circle fa-stack-2x text-danger"></i>
                    <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                  </span>
                  <span className="fa-stack fa-fw stats-icon">
                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                    <i className="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
                  </span>
                  <span className="stats-total">40M</span>
                </div>
              </div>
              {/* Timeline Footer */}
              <div className="timeline-footer">
                <a href="javascript:;" className="m-r-15 text-inverse-lighter">
                  <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like
                </a>
                <a href="javascript:;" className="m-r-15 text-inverse-lighter">
                  <i className="fa fa-comments fa-fw fa-lg m-r-3"></i> Comment
                </a>
                <a href="javascript:;" className="m-r-15 text-inverse-lighter">
                  <i className="fa fa-share fa-fw fa-lg m-r-3"></i> Share
                </a>
              </div>
              {/* Timeline Comment Box */}
              <div className="timeline-comment-box">
                <div className="user">
                  <img src="/src/assets/clydethegoat.jpg" alt="" />
                </div>
                <div className="input">
                  <form action="">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control rounded-corner"
                        placeholder="Write a comment..."
                      />
                      <span className="input-group-btn p-l-10">
                        <button
                          className="btn btn-primary f-s-12 rounded-corner"
                          type="button"
                        >
                          Comment
                        </button>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </li>
          {/* ... Add other timeline items here ... */}
        </ul>
        {/* End Timeline */}
      </div>
      {/* End Profile Post Tab */}
    </div>
  );
}

export default Post4;
