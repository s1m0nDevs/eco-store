import React from 'react';
import { Link, Route } from 'react-router-dom';

import { Item } from './Item';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchTotalProductsAmount,
  setCurrentPage,
} from '../../redux/actions/products';

import SlickSlider from 'react-slick';

import './style.css';
import ScrollToTop from '../../ScrollToTop';
import { Loader } from '../Loader';
import { addToCart } from '../../redux/actions/cart';
import { Pagination } from './Pagination';

function Arrow(props: any) {
  let className = props.type === 'next' ? 'right-0' : 'left-0';
  className +=
    ' absolute z-50 top-0 h-83 flex justify-center items-center px-2 cursor-pointer transition duration-300 ease-in-out text-green-700 hover:text-opacity-100 text-opacity-25 font-bold text-6xl';
  const char = props.type === 'next' ? '>' : '<';
  return (
    <span className={className} onClick={props.onClick}>
      {char}
    </span>
  );
}

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <Arrow type="next" />,
  prevArrow: <Arrow type="prev" />,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const ItemsInner = () => {
  const { items, isDataLoaded, currentPage, itemsPerPage, totalProducts } = useSelector(
    ({ products }: any) => products,
  );
  const { category, sortBy } = useSelector(({ filter }: any) => filter);

  const dispatch = useDispatch();

  const onBuy = React.useCallback(
    (item: any, amount: number) => {
      dispatch(
        addToCart({
          [item.id]: {
            imageUrl: item.imageUrl,
            name: item.name,
            price: item.price,
            amount,
          },
        }),
      );
    },
    [dispatch],
  );

  const onSetPage = React.useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch],
  );

  React.useEffect(() => {
    dispatch(fetchProducts(category, sortBy, currentPage, itemsPerPage));
    dispatch(fetchTotalProductsAmount());
  }, [category, sortBy, currentPage]);
  // console.log('Rerender Items');
  return (
    <div className="container mt-10 bg-gray-100 py-8">
      <Route exact path="/">
        <div className="text-center w-full block mb-8 text-custom-green font-bold text-lg">
          <Link className="link-hover-center" to="/products">
            Посмотреть все товары
          </Link>
        </div>
        <SlickSlider {...settings} className="flex flex-wrap product-list">
          {isDataLoaded ? (
            items.map((item: any, index: number) => (
              <Item
                key={item.price + index + item.imageUrl}
                extraHide={true}
                item={item}
                buyHandler={onBuy}
              />
            ))
          ) : (
            <Loader />
          )}
        </SlickSlider>
      </Route>
      <ScrollToTop>
        <Route path="/products">
          {isDataLoaded ? (
            <>
              <ul className="flex border border-gray-400 flex-wrap">
                {items.map((item: any) => (
                  <li key={item.id + item.imageUrl} className="lg:w-1/4 md:w-1/2 bg-white">
                    <Item extraHide={false} item={item} buyHandler={onBuy} />
                  </li>
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPosts={totalProducts}
                itemsPerPage={itemsPerPage}
                handleSetPage={onSetPage}
              />
            </>
          ) : (
            <div className="flex items-center justify-center main-container">
              <Loader />
            </div>
          )}
        </Route>
      </ScrollToTop>
    </div>
  );
};

export const Items = React.memo(ItemsInner);
