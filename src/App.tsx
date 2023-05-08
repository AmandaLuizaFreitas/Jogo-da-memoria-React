import{ useEffect,useState} from 'react'
import * as C from './App.styles'

import ImgLogo from './assets/logo/devmemory_logo.png'
import RestartIcon from './svgs/restart.svg'

import { InfoItem } from './components/InfoItem';
import {Button} from './components/Button'
import {GridItemType} from './types/GridItemType'
import {items} from './data/item'
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

function App() {
  
  const[playing,setPlaying]=useState<boolean>(false)
  const[timeElapsed,setTimeElapsed] = useState<number>(0)
  const[moveCount,setMoveCount] = useState<number>(0)
  const[shownCount,setShownCount] = useState<number>(0)
  const[gridItem,setGridItem]= useState<GridItemType[]>([]) 

  useEffect(()=>{
    resetAndCreateGrid()
  },[])

  useEffect(()=>{
    const time = setInterval(()=>{
   
     if(playing){

       setTimeElapsed(timeElapsed + 1)
     }
    },1000)
    return() => clearInterval(time)
  },[playing,timeElapsed])


   useEffect(()=>{
    let opened = gridItem.filter((item) => item.shown === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          /** verificação 1 -  se forem iguais, torne o shown permanente */
          let tmpGrid = [...gridItem];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItem(tmpGrid);
          setShownCount(0);
        } else {
          /** verificação 2 - se não forem iguais, feche os "shown" */
          setTimeout(() => {
            let tmpGrid = [...gridItem];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItem(tmpGrid);
            setShownCount(0);
          }, 1000);
        }
        setMoveCount((moveCount) => moveCount + 1)

    
   }},[shownCount,gridItem])
   //Verificação do fim do jogo
   useEffect(()=>{
    if(moveCount > 0 && gridItem.every(item => item.permanentShown===true)){
      setPlaying(false)
    }

   },[moveCount,gridItem])
   
  const resetAndCreateGrid = () => {
     //passo 1- resetart o jogo
     setTimeElapsed(0)
     setMoveCount(0)
     setShownCount(0)
     
      //passo 2-criar o grid
      //2.1- criar um grid vazio
      let tmpGrid:GridItemType[]=[]

      for(let i = 0; i < (items.length * 2);i++){
        tmpGrid.push({
            item:null,
            shown:false,
            permanentShown:false
        })
      }
      // 2.2 preencher o grid
       for(let w = 0; w < 2; w++){
        let pos = -1
        for(let i = 0; i < items.length; i ++){
          while(pos < 0 ||tmpGrid[pos].item !== null){
            pos = Math.floor(Math.random()*(items.length*2))

          }
          tmpGrid[pos].item = i

        }
       }
      //2.3 jogar no state

      setGridItem(tmpGrid) 

     //passo  3 -criar o grid e começa o jogo
    setPlaying(true)
    
   
    

  }
  const handleItemClick = (index:number) =>{
        if(playing&& index !== null && shownCount < 2){
         let tmpGrindClone = [...gridItem]
          
         if(tmpGrindClone[index].permanentShown ===false && tmpGrindClone[index].shown===false){
          tmpGrindClone[index].shown=true;
          setShownCount(shownCount + 1)
         }
         setGridItem(tmpGrindClone)
        }
     
  }

  return (
    <C.Container>
     <C.Info>
     <C.LogoLink>
     <img src={ImgLogo} alt="logo" width="200"/>
     </C.LogoLink>
     <C.InfoArea>
      shownCount:{shownCount}
     
     <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed) }/>
     <InfoItem label='Movimento'value={moveCount.toString()}/>
     </C.InfoArea>
     <Button label='Reiniciar' icon={RestartIcon } onClick={resetAndCreateGrid}/>
     </C.Info>
     <C.GridArea>
      <C.Grid>
        {gridItem.map((item,index)=>(
          <GridItem
            key={index}
             item={item}
             onClick={()=>handleItemClick(index)}
            
            />
        ))}

      </C.Grid>
     </C.GridArea>
    </C.Container>
  );
}

export default App;
