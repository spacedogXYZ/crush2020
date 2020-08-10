// import ReactDOM from 'react-dom'
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faArrowLeft, faArrowRight, faCheck,
    faVoteYea, faCalendarTimes, faMoneyBillWave, faUsers,
    faExclamationTriangle, faHandHoldingHeart, faGlobeAmericas,
    faPlusSquare, faShieldAlt, faPassport, faUserMd, faBuilding,
    faEdit, faCommentDots, faMobileAlt, faFilm, faBalanceScale,
    faCode, faSignLanguage
} from "@fortawesome/free-solid-svg-icons"

library.add(faArrowLeft, faArrowRight, faCheck)
// frontpage
library.add(faVoteYea, faCalendarTimes, faMoneyBillWave, faUsers)
// issues
library.add(faExclamationTriangle, faHandHoldingHeart, faGlobeAmericas,
    faPlusSquare, faVoteYea, faShieldAlt, faPassport, faUserMd, faBuilding
)
// skills
library.add(faEdit, faCommentDots, faMobileAlt, faFilm, faBalanceScale, faCode, faSignLanguage)
library.add(fab)

export default library
