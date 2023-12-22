import { useAtom, useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { cartProductState } from '../../store/cartProductState'
import { Button } from '../common/Button'
import TitleAndLine from '../common/TitleAndLine'
import { calculatePrice } from '../lib/calculatePrice'
import CartItem from './CartItem'
import { CartReturnType } from './cartTypes'
import { useDeleteAllCart } from './hooks/useCart'

const CartList = ({ cartLists }: { cartLists: CartReturnType[] }) => {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useAtom(cartProductState)
  const [isAllItemSelected, setIsAllItemSelected] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)
  const { mutate: deleteAllCartItems } = useDeleteAllCart()

  const onClickDeleteAll = () => {
    setSelectedProduct([])
    deleteAllCartItems(cartLists[0].cartId)
  }

  const onClickPurchaseSelectedItemBtn = () => {
    router.push('/order')
  }
  const onClickPurchaseAllBtn = () => {
    setSelectedProduct(cartLists)
    router.push('/order')
  }

  // selectedProductId 변경 시 마다 가격 계산
  useEffect(() => {
    const selectedProductPrices = selectedProduct.map(
      (selected) => selected.product.price * selected.quantity
    )
    setTotalPrice(selectedProductPrices.reduce((acc, cur) => acc + cur, 0))
  }, [selectedProduct])

  // 첫 렌더링 때 모든 아이템 체크 된 상태 만들기
  useEffect(() => {
    setSelectedProduct(
      cartLists.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.discount
            ? calculatePrice(item.product.price, item.product.discount)
            : item.product.price,
        },
      }))
    )
  }, [])

  return (
    <div className="shadow-basic rounded-md p-4 mt-[40px]">
      <TitleAndLine title="상품" />
      <div className="flex items-center justify-between my-[20px] pb-[20px] gap-2 border-b-[1px] border-disabled">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-[15px] h-[15px] mr-2"
            checked={isAllItemSelected}
            onChange={() => setIsAllItemSelected((prev) => !prev)}
            onClick={() => {
              if (isAllItemSelected) {
                setSelectedProduct([])
              } else {
                setSelectedProduct(cartLists)
              }
            }}
          />
          {isAllItemSelected ? (
            <div>
              전체 해제 ({selectedProduct.length} / {cartLists.length})
            </div>
          ) : (
            <div>
              전체 선택 ({selectedProduct.length} / {cartLists.length})
            </div>
          )}
        </div>
        <button className="text-textDisabled hover:text-disabled" onClick={onClickDeleteAll}>
          전체 삭제
        </button>
      </div>
      <div className="flex gap-3">
        <div className="flex-col grow-[4]">
          {cartLists &&
            cartLists.map((cartList) => (
              <CartItem
                cartList={cartList}
                key={cartList.productId}
                isSelectedItem={isAllItemSelected}
              />
            ))}
        </div>
        <div className="flex-col grow justify-center items-center my-4">
          {/**지불 금액 */}
          <div className="shadow-basic rounded-md p-4 border-[2px] border-main">
            <div className="text-main font-bold text-lg">지불 금액</div>
            <div className="flex items-center justify-between mt-[20px]">
              <div className=" font-bold">총 상품 금액</div>

              <div className="font-bold text-main">
                {totalPrice.toLocaleString()}
                <span className="text-[black] ml-2">원</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-[20px]">
              <div className="font-bold">배송비</div>
              <div className="font-bold text-main">
                3,000<span className="text-[black] ml-2">원</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-[20px]">
              <div className="font-bold">결제 예상 금액</div>
              <div className="font-bold text-main">
                {(totalPrice + 3000).toLocaleString()}
                <span className="text-[black] ml-2">원</span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center gap-4 mt-[40px]">
            <Button
              title={`선택 상품 구매`}
              onClick={onClickPurchaseSelectedItemBtn}
              style="disabled:border-none border-[1px] border-main hover:bg-main hover:text-[white]"
              size="md"
              disabled={selectedProduct.length < 1}
            />

            <Button
              title="전체 상품 구매"
              onClick={onClickPurchaseAllBtn}
              style="bg-main border-[1px] border-main text-[white] hover:bg-active  hover:text-[white] hover:border-active"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartList
