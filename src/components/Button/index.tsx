import * as C from './styles'

type Props = {
 label:string;
 icon?:any;
 onClick:React.MouseEventHandler<HTMLDivElement>;
}
export const Button = ({label, icon, onClick}:Props) =>{
 return(
  <C.Container onClick={onClick}>
   
   <C.iconArea>
    {icon &&
     <C.Icon src={icon}/>
    }
   </C.iconArea>

   <C.Label >{label}</C.Label>
  </C.Container>
 )
}