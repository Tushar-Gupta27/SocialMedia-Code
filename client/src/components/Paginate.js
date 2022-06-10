import React, { useEffect } from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { PaginationStyles, ulStyles } from "./paginateStyles";
import { useSelector, useDispatch } from "react-redux";
import { getPostsAction } from "../actions/posts";

function Paginate({ page }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { totalPages } = useSelector((state) => state.postsReducer);
  useEffect(() => {
    if (page) dispatch(getPostsAction(page));
  }, [page, dispatch]);
  return (
    <Pagination
      sx={PaginationStyles}
      classes={{ ul: ulStyles }}
      count={totalPages}
      page={Number(page) || 1}
      variant="outlined"
      size="small"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  );
}

export default Paginate;
