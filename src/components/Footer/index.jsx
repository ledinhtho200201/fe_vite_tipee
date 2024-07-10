import { HeartTwoTone } from "@ant-design/icons";
import './footer.scss'

const Footer = () => {
    return (
        <footer>
            <div>&copy; {new Date().getFullYear()}. Made with <HeartTwoTone /> - Read in your own way.</div>
        </footer>
    )
}

export default Footer;