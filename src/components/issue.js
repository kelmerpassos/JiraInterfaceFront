import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Issue extends Component {
    render (){
        const { history } = this.props;

        return (
          <div>
              <Link to="#" onClick={history.goBack}> Back </Link>
              <h1>Issue</h1>
          </div>
        );
    }
}
