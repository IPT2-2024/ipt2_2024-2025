// DropdownReligion.js
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DropdownReligion = ({ value, onChange, disabled }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="Select Religion"
            disabled={disabled}
            style={{ width: '100%' }}
        >
            <Option value="romanCatholic">Roman Catholic</Option>
            <Option value="iglesiaNiCristo">Iglesia ni Cristo</Option>
            <Option value="christian">Christian</Option>
            <Option value="islam">Islam</Option>
            <Option value="buddhism">Buddhism</Option>
            <Option value="jehovahsWitness">Jehovah's Witness</Option>
            <Option value="baptist">Baptist</Option>
            <Option value="protestant">Protestant</Option>
            <Option value="seventhDayAdventist">Seventh Day Adventist</Option>
            <Option value="mormon">Mormon</Option>
            <Option value="aglipayan">Aglipayan</Option>
            <Option value="pentecostal">Pentecostal</Option>
            <Option value="foursquareGospelChurch">Foursquare Gospel Church</Option>
            <Option value="bornAgainChristian">Born Again Christian</Option>
            <Option value="christianity">Christianity</Option>
            <Option value="realityOfChrist">Reality of Christ</Option>
            <Option value="freeMethodist">Free Methodist</Option>
            <Option value="uccp">UCCP</Option>
            <Option value="evangelicalAssembliesOfGod">Evangelical (Assemblies of God)</Option>
            <Option value="latterDaySaints">Latter Day Saints</Option>
            <Option value="unitedPentecostalChurch">United Pentecostal Church</Option>
            <Option value="iglesiaFilipinaIndependiente">Iglesia Filipina Independiente</Option>
            <Option value="philippineIndependentCatholic">Philippine Independent Catholic</Option>
            <Option value="jesusIsLord">Jesus is Lord</Option>
            <Option value="pecc">PECC</Option>
            <Option value="assemblyOfGod">Assembly of God</Option>
            <Option value="alliance">Alliance</Option>
            <Option value="philippineIndependentChurch">Philippine Independent Church</Option>
            <Option value="jesusMiracleCrusade">Jesus Miracle Crusade</Option>
            <Option value="moncadista">Moncadista</Option>
            <Option value="evangelicalChristian">Evangelical Christian</Option>
            <Option value="evangelical">Evangelical</Option>
            <Option value="churchOfChrist">Church of Christ</Option>
            <Option value="twelveTribesOfIsrael">12 Tribes of Israel</Option>
            <Option value="christBeliever">Christ Believer</Option>
            <Option value="missionaryBaptist">Missionary Baptist</Option>
            <Option value="fundamentalBaptist">Fundamental Baptist</Option>
            <Option value="newApostolic">New Apostolic</Option>
            <Option value="bibleBaptist">Bible Baptist</Option>
            <Option value="meca">MECA</Option>
            <Option value="bibleBelievers">Bible Believers</Option>
            <Option value="sikh">Sikh</Option>
            <Option value="membersChurchOfGodInternational">Members Church of God International</Option>
            <Option value="newDayCaptiveMinistry">New Day Captive Ministry, Int.</Option>
            <Option value="churchOfGod">Church of God</Option>
            <Option value="bibleBasedChristian">Bible Based Christian</Option>
            <Option value="pdaChurch">P.D.A. Church</Option>
            <Option value="sovereignGraceLifeChurch">Sovereign Grace Life Church</Option>
            <Option value="pilinista">Pilinista</Option>
            <Option value="philcanChristianAlliance">Philcan Christian Alliance</Option>
            <Option value="christFaithFellowship">Christ Faith Fellowship</Option>
            <Option value="newTestament">New Testament</Option>
            <Option value="churchOfJesusLatterDaySaints">The Church of Jesus Of Latter Day Saints</Option>
            <Option value="peccavi">PECCAVI</Option>
            <Option value="uccpProtestant">UCCP-Protestant</Option>
            <Option value="pegami">PEGAMI</Option>
        </Select>
    );
};

export default DropdownReligion;
