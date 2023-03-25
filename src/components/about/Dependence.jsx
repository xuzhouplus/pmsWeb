import React from 'react';
import "./Dependence.scss";

class Dependence extends React.Component {
    render() {
        return (
            <div className="container-fluid pt-2 pb-2 based-on">
                <div className="row justify-content-center">
                    <div className="col col-auto">
                        <a className="text-dark" href="https://reactjs.org/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo react" alt="React" src={process.env.PUBLIC_URL + '/images/About/react.svg'}></img>React
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="text-dark" href="http://getbootstrap.com" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo bootstrap" alt="Bootstrap" src={process.env.PUBLIC_URL + '/images/About/bootstrap.svg'}></img>Bootstrap
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="text-dark" href="https://react-bootstrap.github.io/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo react-bootstrap" alt="react-bootstrap" src={process.env.PUBLIC_URL + '/images/About/react-bootstrap.svg'}></img>react-bootstrap
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="text-dark" href="https://gl-transitions.com/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo gl-transitions" alt="gl-transitions" src={process.env.PUBLIC_URL + '/images/About/glt.png'}></img>gl-transitions
                        </a>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-auto">
                        <a className="text-dark" href="http://nginx.org/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo nginx" alt="Nginx" src={process.env.PUBLIC_URL + '/images/About/nginx.png'}></img>Nginx
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="text-dark" href="https://gin-gonic.com/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo gin" alt="Gin" src={process.env.PUBLIC_URL + '/images/About/gin.png'}></img>Gin
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="text-dark" href="https://www.mysql.com/" target="_blank" rel="noreferrer noopener">
                            <img className="brand-logo mysql" alt="MySQL" src={process.env.PUBLIC_URL + '/images/About/mysql.svg'}></img>MySQL
                        </a>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-auto">
                        <a className="link-box text-dark" href="https://www.xuzhouplus.com.cn/eat.html" target="_blank" rel="noreferrer noopener external nofollow">
                            <span className="eat-span">?</span>
                            吃什么？
                        </a>
                    </div>
                    <div className="col col-auto">
                        <a className="link-box text-dark" href="https://www.xuzhouplus.com.cn/resume" target="_blank" rel="noreferrer noopener external nofollow">
                            <span className="resume-span">@</span>
                            关于作者
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dependence;
