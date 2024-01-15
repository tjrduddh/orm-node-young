module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"channel_member",
		{
			channel_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				comment: "채널 고유번호 (외래키)",
			},
			member_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				comment: "회원 고유번호 (외래키)",
			},
			nick_name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				comment: "닉네임",
			},
			member_type_code: {
				type: DataTypes.TINYINT,
				allowNull: true,
				comment: "회원 유형 코드",
			},
			active_state_code: {
				type: DataTypes.TINYINT,
				allowNull: true,
				comment: "활성 상태 코드",
			},
			last_contact_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "최근 접속 일자",
			},
			last_out_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "최근 퇴장 일자",
			},
			connection_id: {
				type: DataTypes.STRING(100),
				allowNull: true,
				comment: "접속 ID",
			},
			ip_address: {
				type: DataTypes.STRING(50),
				allowNull: true,
				comment: "IP 주소",
			},
			edit_member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "수정 회원 ID",
			},
			edit_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "수정 일자",
			},
		},
		{
			sequelize,
			tableName: "channel_member",
			timestamps: false,
			comment: "채널 회원 정보",
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: ["channel_id", "member_id"],
				},
				{
					name: "FK_channel_id",
					using: "BTREE",
					fields: ["channel_id"],
				},
				{
					name: "FK_member_id",
					using: "BTREE",
					fields: ["member_id"],
				},
			],
		}
	);
};