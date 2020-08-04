// import ReactDOM from 'react-dom'
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faArrowLeft, faArrowRight, faCheck,
    faVoteYea, faCalendarTimes, faMoneyBillWave, faUsers
} from "@fortawesome/free-solid-svg-icons"

library.add(faArrowLeft, faArrowRight, faCheck)
library.add(faVoteYea, faCalendarTimes, faMoneyBillWave, faUsers)
library.add(fab)

export default library
