export default function notifyAlert(props,msg='')
{
    props.show_alert({alertMsg:msg,showAlert:true});
    setTimeout(() => {
      props.show_alert({showAlert:false});
    }, 2000);
}