import { Card } from '@material-ui/core'
import React from 'react';
import {CardContent,Typography} from "@material-ui/core";

function InfoBox({title,cases,total}) {
    return (
        <div>
            <Card>
                <CardContent>
                    {/* Title */}
                    <Typography className="infobox_titel" color="textSecondary">
                        {title}
                    </Typography>

                    {/* no of cases */}
                    <h2 className="infobox_cases">{cases}</h2>

                    {/* Total cases */}
                    <Typography className="infobox_total" color="textSecondary">
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox
