import moment from 'moment'
import styles from './Race.module.scss'
import withTranslation from 'next-translate/withTranslation'

const config = require(`../../db/${process.env.NEXT_PUBLIC_LOCALE_PREFIX}/config.json`)

class RaceTR extends React.Component {
    render() {
        const {t, lang} = this.props.i18n
        moment.locale(lang);

        const hasMultipleFeaturedEvents = this.props.hasMultipleFeaturedEvents;
        const titleKey = "calendar:schedule." + this.props.title;

        return (
            <tr className={`${this.props.collapsed ? styles.collapsed : ''}`}>
                {hasMultipleFeaturedEvents ?
                    <>
                        <td className={styles.iconColumn}/>
                        <td className={styles.eventColumn}>
                            {t(titleKey)}
                        </td>

                        <td/>
                        <td className={styles.dateColumn}>{moment(this.props.date).tz(this.props.timezone).format('D MMM LT')}</td>
                        <td/>
                    </>
                    :
                    <>
                        <td className={styles.iconColumn}/>
                        <td className={styles.eventColumn}>
                            {t(titleKey)}
                        </td>
                        <td className={styles.dateColumn}>{moment(this.props.date).tz(this.props.timezone).format('D MMM')}</td>
                        <td className={styles.timeColumn}>{moment(this.props.date).tz(this.props.timezone).format('LT')}</td>
                        <td/>
                    </>
                }
            </tr>
        );
    }
}

class Race extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false
        }
    }

    handleRowClick() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    componentDidMount() {
        this.setState({
            collapsed: true
        })
    }

    render() {
        const {t, lang} = this.props.i18n
        const localeKey = 'calendar:races.' + this.props.item.localeKey;
        moment.locale(lang);

        const hasMultipleFeaturedEvents = config.featuredSessions.length !== 1;


        function badgeColumnLayout(props) {
            if (props.item.tbc) {
                return (<span title={t('calendar:badges.tbc_title')}
                              className={styles.tbc}>{t('calendar:badges.tbc')}</span>);
            } else if (props.item.canceled) {
                return (<span className={styles.canceled}>{t('calendar:badges.canceled')}</span>);
            } else if (props.item.affiliate) {
                if (moment(props.item.sessions.race).isBefore()) {
                    return (<a className={styles.tickets}>{t('calendar:badges.tickets')}</a>);
                } else {
                    return (<a href={props.item.affiliate}
                               className={styles.ticketsOver}>{t('calendar:badges.tickets')}</a>);
                }
            } else {
                return (``);
            }
        }


        return (
            <tbody id={this.props.item.slug} key={this.props.item.slug}
                   className={`${moment(this.props.item.sessions.race).add(2, 'hours').isBefore() && styles.past} ${this.props.index % 2 === 0 ? 'even' : styles.odd} ${this.props.isNextRace && styles.nextEvent} ${this.props.item.canceled && styles.canceledWeekend} ${this.props.item.tbc && styles.tbcWeekend}`}>

            {!hasMultipleFeaturedEvents ?
                <tr key={this.props.item.slug} className={styles.race} onClick={() => this.handleRowClick()}>
                    <td className={styles.iconColumn}>
                        {this.state.collapsed ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 448">
                                <path fill="white"
                                      d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="white"
                                      d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/>
                            </svg>
                        }
                        < aria-hidden
                           className={`${this.state.collapsed ? 'fas fa-caret-right fa-xs' : 'fas fa-caret-down fa-xs'}`} />
                    </td>
                    <td className={styles.eventColumn}>
                        {t(`calendar:races.${this.props.item.localeKey}`) != localeKey ? t(`calendar:races.${this.props.item.localeKey}`) : this.props.item.name}
                        {this.props.isNextRace && !this.props.item.tbc && !this.props.item.canceled &&
                        <span className={styles.next}>{t(`calendar:badges.next`)}</span>
                        }
                    </td>
                    <td className={styles.dateColumn}>{moment(this.props.item.sessions.race).tz(this.props.timezone).format('D MMM')}</td>
                    <td className={styles.timeColumn}>{moment(this.props.item.sessions.race).tz(this.props.timezone).format('LT')}</td>
                    <td className={styles.badgeColumn}>{badgeColumnLayout(this.props)}</td>
                </tr>
                :
                <tr key={this.props.item.slug} className={styles.race} onClick={() => this.handleRowClick()}>
                    <td className={styles.iconColumn}>
                        {this.state.collapsed ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 448">
                                <path fill="white"
                                      d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="white"
                                      d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/>
                            </svg>
                        }
                        < aria-hidden
                           className={`${this.state.collapsed ? 'fas fa-caret-right fa-xs' : 'fas fa-caret-down fa-xs'}`} />
                    </td>
                    <td className={styles.eventColumn}>
                        {t(`calendar:races.${this.props.item.localeKey}`) !== localeKey ? t(`calendar:races.${this.props.item.localeKey}`) : this.props.item.name}
                        {this.props.isNextRace && !this.props.item.tbc && !this.props.item.canceled &&
                        <span className={styles.next}>{t(`calendar:badges.next`)}</span>
                        }
                    </td>
                    {config.featuredSessions.map((item, index) => {
                        return (<td className={styles.featuredSessionsColumn}>
                            <span>{item}</span>
                            {moment(this.props.item.sessions[item]).tz(this.props.timezone).format('D MMM LT')}
                        </td>)
                    })}
                    <td className={styles.badgeColumn}>{badgeColumnLayout(this.props)}</td>
                </tr>
            }

            {config.collapsedSessions.map((item, index) => {
                console.log(item);
                return (<RaceTR date={this.props.item.sessions[item]} title={item} timezone={this.props.timezone}
                                i18n={this.props.i18n} localeKey={this.props.item.localeKey}
                                collapsed={this.state.collapsed}
                                hasMultipleFeaturedEvents={hasMultipleFeaturedEvents}/>);
            })}

            </tbody>
        );
    }
}

export default withTranslation(Race)


/*

function badgeColumnLayout(props) {
if (props.item.tbc) {
return (<span title={t('calendar:badges.tbc_title')} className={styles.tbc}>{t('calendar:badges.tbc')}</span>);
} else if (props.item.canceled) {
return (<span className={styles.canceled}>{t('calendar:badges.canceled')}</span>);
} else if (props.item.affiliate) {
if (moment(props.item.sessions.race).isBefore()) {
return (<a className={styles.tickets}>{t('calendar:badges.tickets')}</a>);
} else {
return (<a href={props.item.affiliate} className={styles.ticketsOver}>{t('calendar:badges.tickets')}</a>);
}
} else {
return (``);
}
}

if (this.props.item.sessions == null) {
return (
<tbody id={this.props.item.slug} key={this.props.item.slug}
className={`${this.props.index % 2 === 0 ? 'even' : 'odd'} ${this.props.item.canceled ? styles.canceledWeekend : ''} ${this.props.item.tbc ? styles.tbcWeekend : ''}`}>
<tr key={this.props.item.slug} className={styles.race}>
<td className={styles.iconColumn}>
<i class="fas fa-question fa-xs"></i>
</td>
<td className={styles.eventColumn}>
<span>
{t(`calendar:races.${this.props.item.localeKey}`) != localeKey ? (
    t(`calendar:races.${this.props.item.localeKey}`)
) : (
    this.props.item.name
)
}
</span>
</td>
<td className={styles.dateColumn}></td>
<td className={styles.timeColumn}></td>
<td className={styles.badgeColumn}>
{ticketColumnLayout(this.props)}
</td>
</tr>
</tbody>
);
}
*/