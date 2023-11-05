import dynamic from 'next/dynamic'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ProductReturnType } from '../../types/productTypes'
import AmountCounter from '../common/AmountCounter'
import Select from '../common/Select'
import SubSlider from '../common/SubSlider'
import ProductDetailDesc from './ProductDetailDesc'
import ProductDetailReview from './ProductDetailReview'

interface PropsType {
  product: ProductReturnType
  isAdditionalSelectModalOpen: boolean
  setIsAdditionalSelectModalOpen: Dispatch<SetStateAction<boolean>>
}

const ProductDetail = ({
  product,

  isAdditionalSelectModalOpen,
  setIsAdditionalSelectModalOpen,
}: PropsType) => {
  const { name, id, descImg, price, discount, quantity, description, subTitle, deliver } = product
  const [productQuantities, setProductQuantities] = useState<number>(1)
  const [additionalSelect, setadditionalSelect] = useState('')
  const [additionalQuantities, setAdditionalQuantities] = useState(1)

  const [displayPrice, setDisplayPrice] = useState(discount ? price - price / discount : price)

  const [totalPrice, setTotalPrice] = useState(0)

  const [viewDescTab, setViewDescTab] = useState(0)
  useEffect(() => {
    if (productQuantities > 0) setDisplayPrice(productQuantities * price)
  }, [additionalSelect, productQuantities, price])

  useEffect(() => {
    setTotalPrice(additionalSelect ? additionalQuantities * 5000 + displayPrice : displayPrice)
  }, [displayPrice, additionalQuantities, additionalSelect])
  return (
    <>
      <div className="flex  rounded-md w-full">
        <SubSlider items={descImg} btn slidePx={110} btnSize={24} />

        <div className="ml-[100px] my-[10px] w-full ">
          <div className="font-semibold text-3xl">{name}</div>
          <div className="text-textDisabled text-md pb-4 border-b-2 border-main">{subTitle}</div>
          <div className="mt-[10px] flex justify-end items-center gap-x-4">
            {discount ? (
              <>
                <div className="text-textDisabled line-through text-xl">
                  {price.toLocaleString()}원
                </div>
                <div className="text-2xl text-main font-bold">
                  {(price - price / discount).toLocaleString()}원
                </div>
              </>
            ) : (
              <div className="text-2xl text-main font-bold">{price.toLocaleString()}원</div>
            )}
          </div>

          <div className="text-lg border-t border-disabled mt-[20px] pt-[10px] font-bold">
            배송 여부
          </div>
          {!deliver ? (
            <div className="text-base text-textDisabled">
              택배 배송 | <span className="font-semibold">3,500원 </span>- 우체국 택배
            </div>
          ) : (
            <div>배송 불가능</div>
          )}

          <div className="relative border-t border-disabled mt-[20px] pt-[10px]">
            <span className="text-lg font-bold">주문 가능 수량</span>
            <div className="text-main text-xl font-bold">{quantity} 개</div>
          </div>

          <div className="relative border-t border-disabled mt-[20px] pt-[10px]">
            <span className="text-lg font-bold">추가 상품</span>
            <span className="text-textDisabled text-sm font-semibold ml-[20px]">
              상품 수량만큼만 주문하실 수 있습니다.
            </span>
            <Select<string>
              options={['선택 안함', '보자기 + 노리개']}
              selected={additionalSelect}
              setSelected={setadditionalSelect}
              isSelectedModalOpen={isAdditionalSelectModalOpen}
              setIsSelectedModalOpen={setIsAdditionalSelectModalOpen}
            />
          </div>

          <div className="my-[40px] flex flex-col border border-disabled rounded-md">
            <div className="mt-[20px] pt-[10px] flex items-center justify-between mx-[30px]">
              <div className="flex flex-col justify-center flex-2">
                <span className="text-lg font-bold">수량 선택하기</span>
                <AmountCounter
                  amount={productQuantities}
                  setAmount={setProductQuantities}
                  limit={quantity}
                />
              </div>
              <div className="text-xl text-main font-bold">{displayPrice.toLocaleString()}원</div>
            </div>
            {!additionalSelect ||
              (additionalSelect !== '선택 안함' && (
                <div className="my-[20px] pt-[10px] flex items-center justify-between mx-[30px]">
                  <div className="flex flex-col justify-center flex-2">
                    <span className="text-base font-bold">추가 상품</span>
                    <AmountCounter
                      amount={additionalQuantities}
                      setAmount={setAdditionalQuantities}
                      limit={productQuantities}
                    />
                  </div>
                  <div className="text-xl text-textDisabled font-bold">
                    {(additionalQuantities * 5000).toLocaleString()}원
                  </div>
                </div>
              ))}
            <div className="flex justify-between items-center mx-[20px] my-[40px]">
              <span className="text-xl font-bold">총 가격</span>
              <span className="text-2xl text-main font-bold">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>
      {/** tab */}
      <div className="w-full h-[80px] flex justify-center items-center my-[40px]">
        <div
          className={`w-[50%] flex justify-center cursor-pointer ${
            viewDescTab === 0
              ? 'border-b-main border-b-2 text-main font-bold'
              : 'border-b-disabled border-b-[1px] text-textDisabled'
          }`}
          onClick={() => setViewDescTab(0)}
        >
          <span className="text-xl py-2">상품 상세 설명</span>
        </div>
        <div
          className={`w-[50%] flex justify-center cursor-pointer ${
            viewDescTab === 1
              ? 'border-b-main border-b-2 text-main font-bold'
              : 'border-b-disabled border-b-[1px] text-textDisabled'
          }`}
          onClick={() => setViewDescTab(1)}
        >
          <span className="text-xl py-2"> 상품 리뷰</span>
        </div>
      </div>
      {!!viewDescTab ? (
        <ProductDetailReview name={name} />
      ) : (
        <ProductDetailDesc description={description} />
      )}
    </>
  )
}

export default ProductDetail
