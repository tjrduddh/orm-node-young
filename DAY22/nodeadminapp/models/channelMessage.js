module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"channel_msg",
		{
			channel_msg_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: "채널 메시지 고유번호",
			},
			channel_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				comment: "채널 고유번호 (외래키)",
			},
			member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "회원 고유번호",
			},
			nick_name: {
				type: DataTypes.STRING(100),
				allowNull: true,
				comment: "닉네임",
			},
			msg_type_code: {
				type: DataTypes.TINYINT,
				allowNull: true,
				comment: "메시지 유형 코드",
			},
			connection_id: {
				type: DataTypes.STRING(100),
				allowNull: true,
				comment: "접속 ID",
			},
			message: {
				type: DataTypes.STRING(1000),
				allowNull: true,
				comment: "메시지 내용",
			},
			ip_address: {
				type: DataTypes.STRING(20),
				allowNull: true,
				comment: "IP 주소",
			},
			top_channel_msg_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "최상위 채널 메시지 고유번호",
			},
			msg_state_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "메시지 상태 코드",
			},
			msg_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "메시지 일자",
			},
			edit_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "수정 일자",
			},
			del_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "삭제 일자",
			},
		},
		{
			sequelize,
			tableName: "channel_msg",
			timestamps: false,
			comment: "채널 메시지 정보",
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "channel_msg_id" }],
				},
				{
					name: "FK_channel_id",
					using: "BTREE",
					fields: [{ name: "channel_id" }],
				},
			],
		}
	);
};
