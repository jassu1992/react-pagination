import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { parse } from 'utils/queryString';
import './pagination.scss';

const Pagination = ({ location, limit, totalResults, className, handlePageFilter }) => {
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (location.search) {
      const searchParam = parse(location.search);
      const pageNo = parseInt(searchParam.page, 10) + 1;
      renderPagination(pageNo);
    } else {
      renderPagination(1);
    }
  }, []);

  useEffect(() => {
    if (location.search) {
      const searchParam = parse(location.search);
      if (searchParam.page && parseInt(searchParam.page, 10) !== currentPage) {
        const pageNo = parseInt(searchParam.page, 10) + 1;
        renderPagination(pageNo);
      } else {
        renderPagination(1);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    if (location.search) {
      const searchParam = parse(location.search);
      if (!searchParam.page) {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  }, [location.search]);

  const renderPagination = (page) => {
    const paginationArray = [];
    const moreFive = totalResults > limit * 5;
    const totalPages = Math.ceil(totalResults / limit);
    page = page ? parseInt(page, 10) : 1;
    setCurrentPage(page);
    new Array(Math.min(5, totalPages)).fill(null).forEach((item, index) => {
      let value = index + 1;
      if (page > 3 && moreFive) {
        if (value === 1) {
          value += '..';
        } else {
          const offset = page >= totalPages - 1 ? (2 - (totalPages - page)) : 0;
          value = page + (index - 2 - offset);
        }
      }

      paginationArray.push(value);
    });

    if (moreFive && totalPages > paginationArray[4]) {
      paginationArray.push(`..${totalPages}`);
    }

    setPagination(paginationArray);
  };

  const updatePage = (page) => {
    const updatedPage = parseInt(page.toString().replace('..', ''), 10);
    setCurrentPage(updatedPage);

    handlePageFilter('page', updatedPage);
  };

  return (
    <section className={`pagination ${className}`}>
      <p className="pagination-tip">
        <span className="tip body-text">Viewing</span>
        <span className="current-page body-text">{(currentPage * limit) - (limit - 1)} - {Math.min(currentPage * limit, totalResults)}</span>
        <span className="tip body-text">of</span>
        <span className="total-count body-text">{totalResults} results</span>
      </p>
      <div className="pagination-controls">
        {currentPage > 1 &&
          <LeftOutlined className="controller_icon left" onClick={() => updatePage(currentPage - 1)} />
        }
        <ul>
          {pagination.map((value) => <li key={value} className={value === currentPage ? 'Pagination_active' : 'body-text pagination-number'} onClick={() => updatePage(value)}>{value}</li>)}
        </ul>
        {currentPage * limit < totalResults &&
          <RightOutlined disabled className="controller_icon right" onClick={() => updatePage(currentPage + 1)} />
        }
      </div>
    </section>
  );
};

export default withRouter(Pagination);
