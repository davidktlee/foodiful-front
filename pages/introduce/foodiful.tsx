// import axios from 'axios'
// import { InferGetStaticPropsType } from 'next'
// import Image from 'next/image'
// import { useRouter } from 'next/router'
// import React, { useCallback, useRef } from 'react'
// import Container from '../../components/common/Container'

// import IntroduceDesc from '../../components/introduce/IntroduceDesc'
// import IntroducePortfolio from '../../components/introduce/IntroducePortfolio'

// export const getStaticProps = async () => {
//   const { data } = await fetch('http://localhost:3000/api/introduce').then((res) => res.json())

//   return {
//     props: { data },
//   }
// }

// // export default function Introduce() {
// export default function Introduce({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
export default function Introduce() {
  //   const { mainImg, descs } = data
  //   return (
  //     <>
  //       <div className="w-screen h-screen relative">
  //         <Image src={mainImg} alt="main-image" fill />
  //       </div>
  //       <Container>
  //         <IntroduceDesc descs={descs} />
  //         <IntroducePortfolio />
  //       </Container>
  //     </>
  //   )
  return <div></div>
}
