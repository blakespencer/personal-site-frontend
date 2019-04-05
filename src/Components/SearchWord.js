import React, { Component } from 'react';

export default class SearchWord extends Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Search</label>
        <input name="query" onChange={this.handleChange} />
      </form>
    );
  }
}
